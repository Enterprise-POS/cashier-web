import { useState } from 'react';

export function useFormState() {
	const [isFormLoading, setFormLoading] = useState(false);

	// Success Toast/UI
	// It could be anything not only for toast
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	// Error Toast
	const [errorMessage, setErrorMessage] = useState('');
	const [showErrorToast, setShowErrorToast] = useState(false);

	function setError({ message }: { message: string }) {
		setShowErrorToast(true);
		setShowSuccessToast(false);
		setErrorMessage(message);
	}

	function setSuccess({ message }: { message: string }) {
		setShowErrorToast(false);
		setShowSuccessToast(true);
		setSuccessMessage(message);
	}

	function setState({ success, error }: { success: boolean | null; error: boolean | null }) {
		if (success !== null && error !== null) throw new Error('[DEV] wrong operation');

		if (success !== null) {
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
