import cookie from 'js-cookie';

export const setToken = (token: string) => {
    cookie.set('formshet_token', token, {
        expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    });
}

export const getToken = () => {
    return cookie.get('formshet_token');
}

export const setProfile = (profile: string) => {
    localStorage.setItem('formshet_profile', profile);
}

export const getProfile = () => {
    let profile = localStorage.getItem('formshet_profile');
    return profile ? JSON.parse(profile) : null;
}