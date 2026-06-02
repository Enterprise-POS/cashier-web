import { editStore } from '@/_lib/store';
import { create } from 'zustand';
import { useFormState } from '@/components/hooks/useFormState';
import { StoreContextType } from '@/components/provider/StoreProvider';

export type InputState = {
	storeName: string;
	address: string;
	phoneNumber: string;
};

type EditStoreInfoActions = {
	onClickSaveChange: (
		tenantId: number,
		storeId: number,
		formState: ReturnType<typeof useFormState>,
		storeCtx: StoreContextType,
	) => Promise<void>;
	onChangeInput: <K extends keyof InputState>(key: K, value: InputState[K]) => void;
	initializeValue: (inpState: InputState) => void;
	reset: () => void;
};

type EditStoreInfoStore = EditStoreInfoActions &
	InputState & {
		_initialState: InputState;
	};

const INITIAL_INPUT_STATE: InputState = {
	storeName: '',
	address: '',
	phoneNumber: '',
};

export const useEditStoreInfoStore = create<EditStoreInfoStore>((set, get) => ({
	...INITIAL_INPUT_STATE,
	_initialState: INITIAL_INPUT_STATE,

	async onClickSaveChange(tenantId, storeId, formState, storeCtx) {
		const { storeName, phoneNumber, address } = get();
		if (formState.state.isFormLoading) return;

		formState.setFormLoading(true);

		const inputType = { storeName, phoneNumber, address };

		try {
			const { error } = await editStore(tenantId, storeId, inputType);

			if (error !== null) {
				formState.setError({ message: error });
				return;
			}

			set({ _initialState: { storeName, phoneNumber, address } });

			// update store provider (storeList)
			storeCtx.editStore(inputType, storeId);

			formState.setSuccess({ message: 'Store information updated successfully.' });
		} catch (e) {
			formState.setError({ message: `Unexpected error: ${(e as Error).message}` });
		} finally {
			formState.setFormLoading(false);
		}
	},

	onChangeInput: (key, value) => set({ [key]: value }),

	initializeValue: inpState =>
		set({
			...inpState,
			_initialState: inpState,
		}),

	reset: () =>
		set(s => ({
			...s._initialState,
			_initialState: s._initialState,
		})),
}));

export const selectIsDirty = (s: EditStoreInfoStore): boolean => {
	if (!s._initialState) return false;
	return (
		s.storeName !== s._initialState.storeName ||
		s.address !== s._initialState.address ||
		s.phoneNumber !== s._initialState.phoneNumber
	);
};
