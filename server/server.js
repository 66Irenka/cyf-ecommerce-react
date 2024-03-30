import cors from "cors";
import express from "express";
import db from "./db/db.js";

const app = express();
app.use(express.json());
app.use(cors());

// app.get("/", async (req, res) => {
//   try {
//     const result = await db.query("select version()");
//     res.status(200).send(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(504).json({ error });
//   }
// });

app.get("/", (req, res) => {
  db.query("select version()")
    .then((result) => {
      res.status(200).send(result.rows[0]);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/customers", async (req, res) => {
  try {
    const result = await db.query("select * from customers order by name asc");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

app.get("/suppliers", async (req, res) => {
  try {
    const result = await db.query("select * from suppliers order by name asc");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await db.query("select * from products");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/availability", async (req, res) => {
  const queryString = `
    SELECT
      p.id AS product_id,
      p.product_name,
      MIN(pa.unit_price) AS min_unit_price,
      COUNT(DISTINCT s.id) AS supplier_count
    FROM
      product p 
    LEFT JOIN
      product_availability pa ON pa.prod_id = p.id
    LEFT JOIN
      suppliers s ON s.id = pa.supp_id
    GROUP BY
      p.id, p.product_name`;

  try {
    const result = await db.query(queryString); //added queryString
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/availability/product-id/:productId", async (req, res) => {
  let productId = req.params[`productId`];
  const availabilityByProductId = `select
	pa.prod_id as productId,
   inner join suppliers s
	pa.supp_id as supplier_id,
	s.supplier_name,
	pa.unit_price
from
	product_availability pa
inner join suppliers s 
      on
	pa.supp_id = s.id
  WHERE pa.prod_id = $1
ORDER BY 
      productId`;

  // http://localhost:4000/availability/product-id/`insert into users (email, passwors) values ('criminal@example.com', '123')`

  try {
    const result = await db.query(availabilityByProductId, [productId]);
    if (result.rows) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({
        error: `couldn't find availability for productId ${productId}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

app.listen(process.env.PORT || 4000, function () {
  console.log(
    `Server is listening on port ${
      process.env.PORT || 4000
    }. Ready to accept requests!`
  );
});
