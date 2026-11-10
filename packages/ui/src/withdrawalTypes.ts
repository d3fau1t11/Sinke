export interface WithdrawalForm {
  method: 'cbe' | 'telebirr';
  amount: string;
  accountNumber: string;
  accountName: string;
}

export interface WithdrawalSheetProps {
  visible: boolean;
  balance: number;
  form: WithdrawalForm;
  onChange: (form: WithdrawalForm) => void;
  onSubmit: () => void;
  onClose: () => void;
  error: string;
  reference: string;
}
