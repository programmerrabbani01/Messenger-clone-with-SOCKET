import axios from "axios";

export const sendSMS = async (to, msg) => {
  await axios.get(
    ` http://bulksmsbd.net/api/smsapi?api_key=vuexh2IDNu5xIyCm4CFQ&type=${to}&number=Receiver&senderid=8809617613583&message=${msg}`
  );
};
