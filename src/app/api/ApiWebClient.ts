import { ContractState } from '@/interfaces'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class APIClient {
  public axios: AxiosInstance

  constructor(axiosConfig: AxiosRequestConfig) {
    this.axios = Axios.create(axiosConfig)
  }

  public async getContractState(idOrAddress: string): Promise<ContractState> {
    const response = await this.axios.get<ContractState>(`/api/v1/contracts/${idOrAddress}/state`)
    return response.data
  }
}

const APIWebClient = new APIClient({
  baseURL: 'https://testnet.mirrornode.hedera.com/',
  timeout: 60000,
})

export default APIWebClient
