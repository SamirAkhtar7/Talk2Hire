import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apikey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;


if(!apikey || !apiSecret) {
    throw new Error("Missing Stream API Key or Secret");
}

export const chatClient = StreamChat.getInstance(apikey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try { 
        await chatClient.upsertUser(userData);
      console.log("Stream user upserted successfully:",userData);
      

    } catch (err) {
        console.error("Error upserting Stream user:", err);
    }
}


export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);  
        console.log('Stream user deleted:', userId);
    } catch (err) {
        console.error("Error deleting Stream user:", err);
    }
}

//tode:add another method to generateToken 