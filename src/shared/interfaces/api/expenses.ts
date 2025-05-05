export default interface ExpencesResponse {
    accountStatement: AccountStatement;
};

export interface AccountStatement {
    statementNumber: string;
    accountType: string;
    bankName: string;
    period: Period;
    accountDetails: AccountDetails;
    basicAccountData: BasicAccountData;
    transactions: Transaction[];
    finalBalance: number;
    accountServices: string[];
};

export interface Period {
    startDate: string;
    endDate: string;
};

export interface AccountDetails {
    accountNumber: string;
    accountOwner: string;
    accountCurrency: string;
    bankCode: string;
    iban: string;
    bic: string;
};

export interface BasicAccountData {
    initialBalance: number;
    totalRecieved: number;
    totalWithdrawn: number;
    finalBalance: number;
    reservationOfFunds: number;
    availableBalance: number;
}

export interface Transaction {
    date: string;
    description: string;
    amount: number;
    counterAccountNumber?: string;
    transactionDetails?: TransactionDetails;
}

export interface TransactionDetails {
    location?: string;
    name?: string;
    variableSymbol?: string;
    constantSymbol?: string;
    specificSymbol?: string;
    description?: string;
    category?: string;
}
