// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId;
  const name = `WowNfts ${tokenId}`;
  const description =
    "This Nft was made to serve as a means to fight poverty amongst young people";
  const image = `https://ipfs.io/ipfs/QmTE9F9kMByef25UEqq7icArdThTKzQwjtXcbvqCgXykHd ${tokenId}`;
  return res.json({
    name: name,
    description: description,
    image: image,
  });
}
