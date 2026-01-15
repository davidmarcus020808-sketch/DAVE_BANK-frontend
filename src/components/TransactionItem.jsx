import React from 'react';
import { SECONDARY_COLOR, PRIMARY_TEXT } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';

const TransactionItem = React.memo(({ transaction }) => {
  const Icon = transaction.icon;
  const isCredit = transaction.isCredit;
  const amountClass = isCredit ? PRIMARY_TEXT : 'text-gray-800';
  const amountSign = isCredit ? '+' : '-';

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className={`${SECONDARY_COLOR} p-2 rounded-full`}>
          <Icon className={`w-5 h-5 ${PRIMARY_TEXT}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{transaction.type}</p>
          <p className="text-xs text-gray-500">{transaction.description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${amountClass}`}>
          {amountSign}{formatCurrency(Math.abs(transaction.amount))}
        </p>
        <p className="text-xs text-gray-400">{transaction.date.split(',')[0]}</p>
      </div>
    </div>
  );
});

export default TransactionItem;
