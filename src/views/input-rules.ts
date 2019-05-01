export const emailRules: Validator[] = [
    v => !!v || 'E-mail is required',
    v => /.+@.+/.test(v) || 'E-mail must be valid'
];
export const passwordRules: Validator[] = [
    v => !!v || 'Password is required',
    v => v.length >= 6 || 'Password must be greater than 6 characters'
];

export type Validator = (v: string) => boolean | string
