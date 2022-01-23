import express from "express";
import cors from "cors";
import { useCurrentClient } from "../core";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json("Hello World!");
});

app.get("/guild-info", async (req, res) => {
  const { client } = useCurrentClient();
  const guild = await client.guilds.fetch("332309672486895637");

  res.status(200).json({
    iconURL: guild.iconURL({ dynamic: true }),
    members: guild.memberCount,
    banner: guild.bannerURL(),
  });
});

app.post("/ban-appeal", async (req, res) => {
  const { tag, id, reason } = req.body;
  if (!tag || !id || !reason) {
    return res.status(400).json({
      error: "Missing required parameters",
    });
  }
  try {
    const { client } = useCurrentClient();
    const appealChannel = await client.channels.fetch("700365232542973979");
    if (!appealChannel || !appealChannel.isText()) {
      throw new Error("Could not find appeal channel");
    }
    await appealChannel.send(`${tag} (${id})\n${reason}`);
    return res.status(200).json("Submitted appeal");
  } catch {
    return res.status(500).json({
      error: "An error occurred while submitting the ban appeal",
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  useCurrentClient().client.emit("debug", `API server started on port ${port}`);
});
