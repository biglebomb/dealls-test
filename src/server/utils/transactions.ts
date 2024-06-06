import { getServerSingleton } from 'server'

import type { Transaction, TransactionOptions } from 'sequelize'

export const createTransaction = async (
  options?: TransactionOptions,
): Promise<Transaction> => {
  const server = await getServerSingleton()
  return await server.db.sequelize.transaction(options)
}

export const rollback = async (transaction: Transaction | undefined) => {
  if (!transaction) {
    return false
  }
  if ((transaction as any).finished === 'rollback') {
    return false
  }
  await transaction.rollback()
  return true
}
