const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

export const collectionObj = {
  userCollection: "userData",
  booksCollection: "booksCollection",
  cartDataCollection: "cartData",
  paymentCollection: "paymentData"
};

let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

clientPromise = client.connect();

export const dbConnect = async (collectionName) => {
  const client = await clientPromise;
  return client.db(process.env.DB_NAME).collection(collectionName);
};