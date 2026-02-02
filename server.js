const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Citywide AI receptionist is running");
});

// Answer the call
app.post("/voice/inbound", (req, res) => {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Thanks for calling Citywide. Please tell me what service you need and your zip code.
  </Say>
  <Gather input="speech" action="/voice/process" method="POST" timeout="6" speechTimeout="auto">
    <Say voice="alice">Go ahead.</Say>
  </Gather>
  <Say voice="alice">Goodbye.</Say>
  <Hangup/>
</Response>`;
  res.type("text/xml").send(twiml);
});

// Process speech
app.post("/voice/process", (req, res) => {
  const speech = req.body.SpeechResult || "nothing detected";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">I heard: ${speech}</Say>
  <Say voice="alice">We are creating your request now.</Say>
  <Hangup/>
</Response>`;
  res.type("text/xml").send(twiml);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AI receptionist listening on port", PORT);
});

