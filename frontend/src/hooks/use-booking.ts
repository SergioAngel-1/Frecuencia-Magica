'use client';

import { useReducer } from 'react';

import {
  INITIAL_BOOKING,
  bookingReducer,
  canContinue as canContinueCheck,
  canConfirm as canConfirmCheck,
} from '@/lib/booking/booking-reducer';
export type { BookingAction, BookingState } from '@/lib/booking/booking-reducer';

export function useBooking() {
  const [state, dispatch] = useReducer(bookingReducer, INITIAL_BOOKING);

  return {
    state,
    step: state.step,
    pickDate: (date: string) => dispatch({ type: 'PICK_DATE', date }),
    pickTime: (time: string) => dispatch({ type: 'PICK_TIME', time }),
    continue: () => dispatch({ type: 'CONTINUE' }),
    back: () => dispatch({ type: 'BACK' }),
    setField: (field: 'name' | 'email' | 'note', value: string) =>
      dispatch({ type: 'SET_FIELD', field, value }),
    confirm: () => dispatch({ type: 'CONFIRM' }),
    reset: () => dispatch({ type: 'RESET' }),
    canContinue: canContinueCheck(state),
    canConfirm: canConfirmCheck(state),
  };
}
