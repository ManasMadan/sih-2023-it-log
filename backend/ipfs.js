const Moralis = require("moralis").default;

Moralis.start({ apiKey: process.env.MORALIS_KEY });

const addFileToIPFS = async (path, base64Content) => {
  const response = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: [{ path: path, content: base64Content }],
  });
  return response.result;
};
const addFilestoIPFS = async (arrayofPathandbase64content) => {
  const response = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: arrayofPathandbase64content,
  });
  return response.result;
};
module.exports = { addFileToIPFS, addFilestoIPFS };
