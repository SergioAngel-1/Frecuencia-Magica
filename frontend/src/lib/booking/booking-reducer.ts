export type BookingState = {
  step: number;
  date: string | null;
  time: string | null;
  name: string;
  email: string;
  note: string;
};

export type BookingAction =
  | { type: 'PICK_DATE'; date: string }
  | { type: 'PICK_TIME'; time: string }
  | { type: 'CONTINUE' }
  | { type: 'BACK' }
  | { type: 'SET_FIELD'; field: 'name' | 'email' | 'note'; value: string }
  | { type: 'CONFIRM' }
  | { type: 'RESET' };

export const INITIAL_BOOKING: BookingState = {
  step: 0,
  date: null,
  time: null,
  name: '',
  email: '',
  note: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function canContinue(state: BookingState): boolean {
  return state.date !== null && state.time !== null;
}

export function canConfirm(state: BookingState): boolean {
  return state.name.trim().length > 0 && EMAIL_RE.test(state.email);
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'PICK_DATE':
      return { ...state, date: action.date };

    case 'PICK_TIME':
      return { ...state, time: action.time };

    case 'CONTINUE':
      if (!canContinue(state)) return state;
      return { ...state, step: 1 };

    case 'BACK':
      if (state.step === 1) return { ...state, step: 0 };
      return state;

    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'CONFIRM':
      if (!canConfirm(state)) return state;
      return { ...state, step: 2 };

    case 'RESET':
      return { ...INITIAL_BOOKING };

    default:
      return state;
  }
}
