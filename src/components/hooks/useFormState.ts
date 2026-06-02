import { useEffect, useRef, useState } from 'react';

export function useFormState() {
	const [isFormLoading, setFormLoading] = useState(false);

	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const [errorMessage, setErrorMessage] = useState('');
	const [showErrorToast, setShowErrorToast] = useState(false);

	const timeoutRef = useRef<NodeJS.Timeout>(undefined);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
		};
	}, []);

	function setError({ message }: { message: string }) {
		setShowErrorToast(true);
		setShowSuccessToast(false);
		setErrorMessage(message);

		if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setShowErrorToast(false);
			setShowSuccessToast(false);
			setErrorMessage('');
		}, 10000);
	}

	function setSuccess({ message }: { message: string }) {
		setShowErrorToast(false);
		setShowSuccessToast(true);
		setSuccessMessage(message);

		if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setShowErrorToast(false);
			setShowSuccessToast(false);
			setSuccessMessage(''); // ✅ was missing
		}, 10000);
	}

	function setState({ success, error }: { success?: boolean; error?: boolean }) {
		if (success !== undefined && error !== undefined)
			throw new Error('[DEV] wrong operation: cannot set both success and error');
		if (success === undefined && error === undefined)
			throw new Error('[DEV] wrong operation: must provide either success or error');

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
