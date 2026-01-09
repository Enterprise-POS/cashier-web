import { useRef, useState } from 'react';

export function useFormState() {
	const [isFormLoading, setFormLoading] = useState(false);

	// Success Toast/UI
	// It could be anything not only for toast
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Error Toast
	const [errorMessage, setErrorMessage] = useState('');
	const [showErrorToast, setShowErrorToast] = useState(false);

	// Timeout ref
	const timeoutRef = useRef<NodeJS.Timeout>(undefined);

	function setError({ message }: { message: string }) {
		setShowErrorToast(true);
		setShowSuccessToast(false);
		setErrorMessage(message);

		if (timeoutRef !== undefined) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(async () => {
			setShowErrorToast(false);
			setShowSuccessToast(false);
			setErrorMessage('');
		}, 10000); // 10s
	}

	function setSuccess({ message }: { message: string }) {
		setShowErrorToast(false);
		setShowSuccessToast(true);
		setSuccessMessage(message);

		if (timeoutRef !== undefined) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(async () => {
			setShowErrorToast(false);
			setShowSuccessToast(false);
			setSuccessMessage('');
		}, 10000); // 10s
	}

	function setState({ success, error }: { success?: boolean; error?: boolean }) {
		if (success !== undefined && error !== undefined) throw new Error('[DEV] wrong operation');

		if (success !== undefined) {
			setShowSuccessToast(success);
		} else {
			setShowErrorToast(error!);
		}
	}

	return {
		/*
			When setError or setSuccess called then which one will switched state
			if setError() = isSuccess -> false, isError -> true
			if setSuccess() = isSuccess -> true, isError -> false
		*/
		setError,
		setSuccess,

		/*
			Change form into loading state
			use case: when user click submit button, then form immediately into loading state
		*/
		setFormLoading,

		/*
			Individually set the state
			use case: when closing modal
		*/
		setState,

		/*
			all form current state
		*/
		state: { isError: showErrorToast, isSuccess: showSuccessToast, isFormLoading },

		/*
			use case: When request response success or error, we want to show some modal and message
		*/
		value: { successMessage, errorMessage },
	};
}
