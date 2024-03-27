interface StorageSlot {
  address: string
  contract_id: string
  slot: string
  timestamp: string
  value: string
}

export interface ContractState {
  state: StorageSlot[]
}
