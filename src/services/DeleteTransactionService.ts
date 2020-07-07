import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';

import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (!isUuid(id)) {
      throw new AppError('Invalid id format', 400);
    }

    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
