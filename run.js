const ethers = require("ethers")

const { ContractFactory } = ethers

const WETH_MAINNET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"


const deploy = async (signer, obj, params = []) => {
    const factory = new ContractFactory(obj.abi, obj.bytecode, signer);
    const contract = await factory.deploy(...params);
    return contract.address
}



function fromReadableAmount(amount, decimals) {
    return ethers.utils.parseUnits(amount.toString(), decimals)
}

const transferAmt = async (signer, to, value) => {
    const tx = await signer.sendTransaction({ to, value: ethers.utils.parseEther(value.toString()) })
    await tx.wait()
    console.log(`${await signer.getAddress()} == ${value} => ${to}`)
}




const transferErc = async (sender, addr, to, amount) => {
    const contract = createErc(addr, sender.provider)
    const decimals = await contract.decimals()
    const amt = fromReadableAmount(amount, decimals)
    const data = await contract.populateTransaction.transfer(to, amt)
    const tx = await sender.sendTransaction(data)
    return await tx.wait()
}

const getUserBalanceErc = async (sender, addr) => {
    console.log(sender)
    const contract = createErc(addr, sender.provider)
    const decimals = await contract.decimals()
    const balance = await contract.balanceOf(sender.address)
    return ethers.utils.formatUnits(balance, decimals)
}
const getAddrBalanceErc = async (provider, token, addr) => {
    const contract = createErc(token, provider)
    const decimals = await contract.decimals()
    const balance = await contract.balanceOf(addr)
    return ethers.utils.formatUnits(balance, decimals)
}
const createSigner = async (address) => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address],
    });
    return impersonatedSigner = await ethers.getSigner(address);
}

const execTest = async (addrs, func) => {
    const provider = new ethers.providers.Web3Provider(hreProvider)
    const signers = await Promise.all(addrs.map((addr) => {
        return createSigner(addr)
    }))
    await func(provider, signers)
}

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

const rpcUrl = "http://127.0.0.1:8545"


const pkey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"



const generalDeployment = async (wallet) => {
    const approveAndSwapAddr = await deployApproveAndSwap(wallet)
    console.log(`\n\actionAddr = "${approveAndSwapAddr}"`)
}

const tokenContract = require("./artifacts/contracts/Coin.sol/MyCoin.json")
const deployToken = (signer) => {
    return deploy(signer, tokenContract, ["", ""])
}

const createErc = (addr, provider) => {
    return new ethers.Contract(addr, tokenContract.abi, provider)
}

const mint = async (token, addr, amt) => {
    return await token.populateTransaction.mint(addr, amt)
}

const main = async () => {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const wallet = new ethers.Wallet(pkey, provider)
    const toke = createErc("0x52173b6ac069619c206b9A0e75609fC92860AB2A", wallet.provider)
    const eoa = "0x92ef08FC77A10aE933D90A41180c1F93eEc33D9e"
    const data = await mint(toke, eoa, BigInt("1000000000000000000"))
    const tx = await wallet.sendTransaction(data)
console.log(toke.address)
    tx.wait()

    console.log((await toke.balanceOf(eoa)).toString())

}

if (typeof require !== 'undefined' && require.main === module) {
    main()
}
