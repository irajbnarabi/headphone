import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon       from '@material-ui/icons/Error';
import InfoIcon        from '@material-ui/icons/Info';
import WarningIcon     from '@material-ui/icons/Warning';

export const toastTypes = {
	success: 'success',
	error  : 'danger',
	info   : 'info',
	warning: 'warning'
};

export function ShowToast (type, message, title = '') {
	let toastProperties;
	switch (type) {
		case 'success':
			toastProperties = {
				id             : 1,
				title          : title,
				description    : message,
				backgroundColor: '#5CB85C',
				icon           : CheckCircleIcon
			};
			break;
		case 'danger':
			toastProperties = {
				id             : 2,
				title          : title,
				description    : message,
				backgroundColor: '#6E6E6E',
				icon           : ErrorIcon
			};
			break;
		case 'info':
			toastProperties = {
				id             : 3,
				title          : title,
				description    : message,
				backgroundColor: '#5BC0DE',
				icon           : InfoIcon
			};
			break;
		case 'warning':
			toastProperties = {
				id             : 4,
				title          : title,
				description    : message,
				backgroundColor: '#F0AD4E',
				icon           : WarningIcon
			};
			break;
		default:
			toastProperties = {};
	}
	return [toastProperties];
}
