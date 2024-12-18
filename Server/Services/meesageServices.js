const messageRepo = require("../Repositories/messageRepo");

const getAllMessage = () => {
   return messageRepo.getAllMessage();
};

const createMessage = async (message) => {
    try {
        const result = await messageRepo.createMessage(message);
        if (result != null) {
            return { message: "Created new message successfully", success: true, data: result };
        }
        return { message: "Failed to create message", success: false };
    } catch (error) {
        return { message: `Create new message failed: ${error.message}`, success: false };
    }
};

const updateMessage = async (id, messageData) => {
    try {
        const updatedMessage = await messageRepo.updateMessage(id, messageData);
        if (!updatedMessage) {
            return { message: `Message with id ${id} not found`, success: false };
        }
        return { message: "Message updated successfully", success: true, data: updatedMessage };
    } catch (error) {
        return { message: `Update message failed: ${error.message}`, success: false };
    }
};

const deleteMessage = async (id) => {
    try {
        const deletedMessage = await messageRepo.deletedMessage(id);  // Corrected method name
        if (!deletedMessage) {
            return { message: `Message with id ${id} not found`, success: false };
        }
        return { message: "Message deleted successfully", success: true };
    } catch (error) {
        return { message: `Delete message failed: ${error.message}`, success: false };
    }
};

const getMessageHistory = async (userId) => {
    try {
        // Assuming messageRepo.getMessageHistory returns a query, not an array.
        const messages = await messageRepo.getMessageHistory(userId);
        const sortedMessages = messages.sort((a, b) => a.date-b.date ).slice(0, 20);  // Sort and limit on the application side if needed.
        return { message: "", success: true, data: sortedMessages };
    } catch (error) {
        return { message: `Failed to get message history: ${error.message}`, success: false };
    }
};

module.exports = { getAllMessage, getMessageHistory, createMessage, updateMessage, deleteMessage };