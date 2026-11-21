import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ExpenseSearchInput } from '@/_interface/ExpenseDef';
import { getExpenseCategories, searchExpenses } from '@/_lib/client_expense';
import { minutes } from '@/_lib/utils';
import { Constants } from '@/components/core/data/constant';

export function useExpensesQuery(token: string, tenantId: number, input: ExpenseSearchInput) {
	return useQuery({
		queryKey: [Constants.ReactQueryKey.expenses, tenantId, input],
		queryFn: async () => {
			const { result, error } = await searchExpenses(tenantId, token, input);
			if (error !== null) throw new Error(error);
			return result!;
		},
		enabled: tenantId !== 0,
		staleTime: minutes(5),
		refetchOnWindowFocus: false,
	});
}

export function useExpenseCategoriesQuery(token: string, tenantId: number) {
	return useQuery({
		queryKey: [Constants.ReactQueryKey.expenseCategories, tenantId],
		queryFn: async () => {
			const { result, error } = await getExpenseCategories(tenantId, token);
			if (error !== null) throw new Error(error);
			return result!;
		},
		enabled: tenantId !== 0,
		staleTime: minutes(5),
		refetchOnWindowFocus: false,
	});
}

// After any write: list, categories (names are joined into the list) and the dashboard net profit
export function useInvalidateExpenses() {
	const queryClient = useQueryClient();
	return () => {
		queryClient.invalidateQueries({ queryKey: [Constants.ReactQueryKey.expenses] });
		queryClient.invalidateQueries({ queryKey: [Constants.ReactQueryKey.expenseCategories] });
		queryClient.invalidateQueries({ queryKey: [Constants.ReactQueryKey.salesReport] });
	};
}
