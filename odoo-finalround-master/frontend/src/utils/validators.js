export const required = (v) => (v ? null : 'Required');
export const isEmail = (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email');


