import { CONTRACT_ID } from '@/constants'
import { ContractFunctionParameters, ContractExecuteTransaction } from '@hashgraph/sdk'

export const whitelist = async (address: string, signer: any) => {
  const contractExecuteTx = await new ContractExecuteTransaction()
    .setContractId(CONTRACT_ID)
    .setGas(10000000)
    .setFunction('whitelist', new ContractFunctionParameters().addAddress(address))
    .freezeWithSigner(signer)

  const contractExecuteSubmit = await contractExecuteTx.executeWithSigner(signer)
  const contractExecuteRx = await contractExecuteSubmit.getReceiptWithSigner(signer)
  console.log(`- Contract function call status: ${contractExecuteRx.status} \n`)
}
