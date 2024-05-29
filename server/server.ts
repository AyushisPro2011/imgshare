import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv"

dotenv.config()
const app = express();
const port: number = 8080;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const str = process.env.DATABASE_URL
const client = new MongoClient(str || "");

interface ImageData {
  filename: string;
  description: string;
  author: string;
  date: Date;
  png: Buffer;
  jpg?: Buffer;
  webp?: Buffer;
  ico?: Buffer;
}
interface ImageReadData {
  filename: string;
  description: string;
  author: string;
  date: Date;
  data: Buffer;
}

async function CreateFile(ImageData: ImageData): Promise<boolean> {
  try {
    await client.connect();
    const database = client.db("imgshare");
    const collection = database.collection("test");
    await collection.insertOne({
      filename: ImageData.filename,
      png: ImageData.png,
      jpg: ImageData.jpg,
      webp: ImageData.webp,
      ico: ImageData.ico,
      filedescription: ImageData.description,
      fileauthor: ImageData.author,
      uploaddate: ImageData.date,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.close();
  }
}

async function ReadFile(id: string): Promise<any> {
  try {
    await client.connect();
    const db = client.db("imgshare");
    const collection = db.collection("test");
    const result = await collection.findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.close();
  }
}

async function UpdateFile(
  query: string,
  ImageData: ImageData
): Promise<boolean> {
  try {
    if (!query || !ImageData) {
      return false;
    }

    await client.connect();
    const db = client.db("imgshare");
    const collection = db.collection("test");
    const result = await collection.updateOne(
      { _id: new ObjectId(query) },
      {
        $set: {
          filename: ImageData.filename,
          png: ImageData.png,
          jpg: ImageData.jpg,
          webp: ImageData.webp,
          ico: ImageData.ico,
          filedescription: ImageData.description,
          fileauthor: ImageData.author,
          uploaddate: ImageData.date,
        },
      }
    );
    if (result.acknowledged) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.close();
  }
}

async function DeleteFile(query: string): Promise<boolean> {
  try {
    await client.connect();
    const db = client.db("imgshare");
    const collection = db.collection("test");
    const result = await collection.deleteOne({ _id: new ObjectId(query) });
    if (result.acknowledged) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    client.close();
  }
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is a Test");
});

app.post(
  "/create",
  upload.fields([
    { name: "png", maxCount: 1 },
    { name: "jpg", maxCount: 1 },
    { name: "webp", maxCount: 1 },
    { name: "ico", maxCount: 1 },
  ]),
  async (req, res) => {
    const { description, author } = req.body;
    const files = req.files as any;
    if (!files || !files.png[0].buffer) {
      res.status(404).send("File not created");
      return;
    }
    const image: ImageData = {
      filename: files.png[0].originalname,
      description: description,
      author: author,
      date: new Date(),
      png: files.png[0].buffer,
      jpg: files.jpg && files.jpg[0] ? files.jpg[0].buffer : undefined,
      webp: files.webp && files.webp[0] ? files.webp[0].buffer : undefined,
      ico: files.ico && files.ico[0] ? files.ico[0].buffer : undefined,
    };
    if (await CreateFile(image)) {
      res.status(201).send("File Created");
    } else {
      res.status(404).send("File Not found");
    }
  }
);

app.get("/read/:id/:type", async (req, res) => {
  const query = req.params.id;
  if (!query) {
    res.status(404).send("File not found or Removed");
    return;
  }
  const type = req.params.type;
  const data: any = await ReadFile(query);
  var response: ImageReadData;
  switch (type) {
    case "png":
      response = {
        filename: data.filename,
        author: data.fileauthor,
        description: data.filedescription,
        date: data.uploaddate,
        data: data.png,
      };
      res.status(200).send(response);
      break;
    case "jpg":
      response = {
        filename: data.filename,
        author: data.fileauthor,
        description: data.filedescription,
        date: data.uploaddate,
        data: data.jpg,
      };
      res.status(200).send(response);
      break;
    case "webp":
      response = {
        filename: data.filename,
        author: data.fileauthor,
        description: data.filedescription,
        date: data.uploaddate,
        data: data.webp,
      };
      res.status(200).send(response);
      break;
    case "ico":
      response = {
        filename: data.filename,
        author: data.fileauthor,
        description: data.filedescription,
        date: data.uploaddate,
        data: data.ico,
      };
      res.status(200).send(response);
      break;
    default:
      res.status(500).send("File format error");
  }
});

app.post(
  "/update/:id",
  upload.fields([
    { name: "png", maxCount: 1 },
    { name: "jpg", maxCount: 1 },
    { name: "webp", maxCount: 1 },
    { name: "ico", maxCount: 1 },
  ]),
  async (req, res) => {
    const { description, author } = req.body;
    const files = req.files as any;
    if (!files || !files.png[0].buffer) {
      res.status(404).send("File not created");
      return;
    }
    const image: ImageData = {
      filename: files.png[0].originalname,
      description: description,
      author: author,
      date: new Date(),
      png: files.png[0].buffer,
      jpg: files.jpg && files.jpg[0] ? files.jpg[0].buffer : undefined,
      webp: files.webp && files.webp[0] ? files.webp[0].buffer : undefined,
      ico: files.ico && files.ico[0] ? files.ico[0].buffer : undefined,
    };
    if (await UpdateFile(req.params.id, image)) {
      res.status(200).send("File Updated Succesfully");
      return;
    } else {
      res.status(500).send("Server Error");
    }
  }
);

app.post("/delete/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).send("File not found");
  }
  if (await DeleteFile(req.params.id)) {
    res.status(200).send("File Deleted Succesfully");
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
