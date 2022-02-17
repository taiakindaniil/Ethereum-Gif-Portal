const main = async () => {
    const gifContractFactory = await hre.ethers.getContractFactory("GifPortal");
    const gifContract = await gifContractFactory.deploy();
    await gifContract.deployed();

    console.log("Contract deployed to:", gifContract.address);

    let gifsCount = await gifContract.getTotalGifs();
    console.log(gifsCount.toNumber());

    // Send some gifs 🌊
    let gifTxn = await gifContract.addGif('https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4db11e128171271.6153059aee670.gif');
    await gifTxn.wait();

    gifTxn = await gifContract.addGif('    ');
    await gifTxn.wait();

    const [_, randomPerson] = await hre.ethers.getSigners();
    gifTxn = await gifContract.connect(randomPerson).addGif('https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4db11e128171271.6153059aee670.gif');
    await gifTxn.wait();
   
    let allGifs = await gifContract.getAllGifs();
    console.log(allGifs);
};
  
const runMain = async () => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch (error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};
  
runMain();