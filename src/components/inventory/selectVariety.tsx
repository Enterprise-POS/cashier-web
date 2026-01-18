'use client';

import Select, { ActionMeta, OnChangeValue, SingleValue } from 'react-select';

export default function SelectVariety({
	options,
	onChange,
}: {
	options: any;
	onChange: (newValue: any, actionMeta: any) => void;
}) {
	return (
		<Select
			onChange={onChange}
			classNamePrefix="react-select"
			options={options}
			placeholder="Choose"
			styles={{
				control: styles => ({
					...styles,
					backgroundColor: 'white', // keep input white
					borderColor: '#ccc',
					boxShadow: 'none',
					'&:hover': { borderColor: '#aaa' },
				}),
				option: (styles, { isDisabled, isFocused, isSelected }) => ({
					...styles,
					backgroundColor: isSelected
						? '#fe9f43' // orange when selected
						: isFocused
						? '#fe9f43' // also orange when hovered
						: 'white',
					color: isSelected || isFocused ? 'white' : '#333',
					cursor: isDisabled ? 'not-allowed' : 'default',
				}),
				singleValue: styles => ({
					...styles,
					color: '#333',
				}),
				menu: styles => ({
					...styles,
					zIndex: 99, // ensures dropdown overlays correctly
				}),
			}}
		/>
	);
}
