import { getCustomRepository, getRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryName: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryName,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError(
        'O valor da saída é maior que o total disponível',
        400,
      );
    }

    let category = await categoryRepository.findOne({
      where: { title: categoryName },
    });

    if (!category) {
      category = categoryRepository.create({
        title: categoryName,
      });

      await categoryRepository.save(category);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
