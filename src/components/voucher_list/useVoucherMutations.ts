import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateVoucherRequest, EditVoucherRequest } from '@/_interface/VoucherDef';
import { createVoucher, deleteVoucher, editVoucher } from '@/_lib/client_voucher';
import { Constants } from '@/components/core/data/constant';
import { useVoucherStore } from '@/components/store/voucherStore';

export function useVoucherMutations(tenantId: number, token: string) {
	const queryClient = useQueryClient();
	const setSuccess = useVoucherStore(state => state.setSuccess);

	const invalidateVouchers = () =>
		queryClient.invalidateQueries({ queryKey: [Constants.ReactQueryKey.vouchers, tenantId] });

	const createMutation = useMutation({
		mutationFn: ({ body }: { body: CreateVoucherRequest }) => createVoucher(tenantId, body, token),
		onSuccess: async () => {
			await invalidateVouchers();
		},
	});

	const editMutation = useMutation({
		mutationFn: ({ voucherId, body }: { voucherId: number; body: EditVoucherRequest }) =>
			editVoucher(tenantId, voucherId, body, token),
		onSuccess: async () => {
			await invalidateVouchers();
			setSuccess('Voucher updated successfully.');
		},
	});

	const deleteMutation = useMutation({
		mutationFn: ({ voucherId }: { voucherId: number }) => deleteVoucher(tenantId, voucherId, token),
		onSuccess: async () => {
			await invalidateVouchers();
			setSuccess('Voucher deleted successfully.');
		},
	});

	return { createMutation, editMutation, deleteMutation };
}
