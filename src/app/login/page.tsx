'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { MessageSquare, PenTool, Sparkles, TrendingUp } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const { data: sessionData } = await supabase.auth.getSession();
            console.log('Session after login:', sessionData);

            window.location.href = '/dashboard';
        } catch (error: unknown) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex animate-fade-in'>
            {/* Left Side - Login Form */}
            <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white'>
                <div className='w-full max-w-md space-y-8'>
                    {/* Branding */}
                    <div className='flex flex-col items-center space-y-3 mb-16'>
                        <div className='text-center'>
                            <div className='flex items-center justify-center space-x-8'>
                                {/* Philoneos Branding */}
                                <div className='flex items-center space-x-3'>
                                    <div className='inline-flex items-center justify-center w-10 h-10 bg-[var(--sidebar-bg)] rounded-lg shadow-lg'>
                                        <PenTool className='w-5 h-5 text-white' />
                                    </div>
                                    <span className='text-lg font-semibold text-gray-700'>
                                        Philoneos
                                    </span>
                                </div>

                                <div className='w-px h-8 bg-gray-300'></div>

                                {/* Scaletech Branding */}
                                <div className='flex items-center space-x-2'>
                                    <svg
                                        width='120'
                                        height='32'
                                        viewBox='0 0 295 80'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-8'
                                    >
                                        <g clipPath='url(#clip0_1919_16)'>
                                            <path
                                                d='M104.418 28.0187L102.418 29.6188C101.418 28.1188 99.9178 27.4188 98.0178 27.4188C96.7178 27.4188 95.6178 27.8187 94.6178 28.5187C93.7178 29.1188 93.2178 30.1187 93.2178 31.4187C93.2178 32.5187 93.6178 33.4187 94.4178 34.1187C95.2178 34.8187 96.2178 35.3187 97.3178 35.6187C98.4178 36.0187 99.6178 36.3188 100.718 36.8188C101.818 37.2188 102.818 37.9188 103.618 38.8188C104.418 39.7188 104.818 41.0188 104.818 42.4188C104.818 44.4188 104.018 45.9188 102.518 47.2188C101.018 48.4188 99.3178 49.0187 97.3178 49.0187C94.2178 49.0187 91.8178 47.9187 90.2178 45.6187L92.3178 44.2188C93.4178 46.0187 95.1178 47.0187 97.5178 47.0187C98.7178 47.0187 99.9178 46.6188 100.918 45.9188C101.918 45.2188 102.418 44.2188 102.418 42.9188C102.418 41.9188 102.118 41.1187 101.518 40.4187C100.918 39.7188 100.218 39.3188 99.4178 39.0188C98.5178 38.7188 97.6178 38.4187 96.6178 38.0188C95.6178 37.6188 94.7178 37.3187 93.8178 36.9187C92.9178 36.5188 92.2178 35.9187 91.7178 35.0188C91.1178 34.1188 90.8178 33.0188 90.8178 31.7188C90.8178 29.6188 91.5178 28.0188 93.0178 26.9188C94.3178 25.8188 96.0178 25.2188 98.0178 25.2188C100.718 25.2188 102.818 26.1187 104.418 28.0187Z'
                                                fill='#00A5CB'
                                            />
                                            <path
                                                d='M129.418 43.5187L131.318 44.8188C130.518 46.0188 129.418 47.0188 127.918 47.8188C126.418 48.6187 124.818 49.0187 122.918 49.0187C119.518 49.0187 116.718 47.9187 114.418 45.6187C112.218 43.3188 111.018 40.5187 111.018 37.1187C111.018 33.7188 112.118 30.8188 114.418 28.6188C116.718 26.3188 119.618 25.2188 123.018 25.2188C124.518 25.2188 125.918 25.5187 127.318 26.1187C128.718 26.7188 129.918 27.6187 130.818 28.8187L128.818 30.3187C128.318 29.5187 127.518 28.8187 126.418 28.2188C125.318 27.6188 124.118 27.3187 123.018 27.3187C120.218 27.3187 117.918 28.3187 116.218 30.2188C114.518 32.1188 113.718 34.4187 113.718 37.1187C113.718 39.8187 114.518 42.1187 116.218 44.0187C117.918 45.9187 120.218 46.9188 123.018 46.9188C125.818 46.9188 128.018 45.8187 129.418 43.5187Z'
                                                fill='#00A5CB'
                                            />
                                            <path
                                                d='M140.518 42.5184L138.018 48.5184H135.318L145.218 25.8184H147.418L157.318 48.5184H154.618L152.118 42.5184H140.518ZM146.318 28.5184L141.418 40.4184H151.218L146.318 28.5184Z'
                                                fill='#00A5CB'
                                            />
                                            <path
                                                d='M165.918 25.8184V46.4184H176.518V48.5184H163.618V25.8184H165.918Z'
                                                fill='#00A5CB'
                                            />
                                            <path
                                                d='M185.118 37.7184V46.3184H197.218V48.4184H182.818V25.8184H196.918V27.9184H185.118V35.6184H196.118V37.7184H185.118Z'
                                                fill='#00A5CB'
                                            />
                                            <path
                                                d='M208.618 48.4184V30.2184H202.118V25.8184H220.018V30.2184H213.518V48.4184H208.618Z'
                                                fill='#010101'
                                            />
                                            <path
                                                d='M226.018 48.4184V25.8184H241.418V30.4184H231.018V34.6184H240.818V39.2184H231.018V43.8184H242.018V48.4184H226.018Z'
                                                fill='#010101'
                                            />
                                            <path
                                                d='M267.818 28.5191L264.018 31.6191C263.018 30.4191 261.518 29.7191 259.718 29.7191C257.818 29.7191 256.218 30.4191 255.018 31.8191C253.818 33.2191 253.118 34.9191 253.118 37.0191C253.118 39.1191 253.718 40.8191 254.918 42.2191C256.118 43.6191 257.618 44.3191 259.518 44.3191C261.518 44.3191 263.118 43.5191 264.218 41.9191L268.418 45.0191C267.518 46.3191 266.318 47.3191 264.818 47.9191C263.318 48.6191 261.818 48.9191 260.218 48.9191C256.618 48.9191 253.718 47.8191 251.418 45.6191C249.118 43.4191 248.018 40.5191 248.018 37.0191C248.018 33.5191 249.118 30.5191 251.418 28.4191C253.718 26.2191 256.618 25.1191 260.218 25.1191C261.618 25.1191 263.018 25.4191 264.418 25.9191C265.818 26.5191 266.918 27.4191 267.818 28.5191Z'
                                                fill='#010101'
                                            />
                                            <path
                                                d='M274.318 48.4184V25.8184H279.318V34.2184H289.018V25.8184H294.018V48.5184H289.018V38.7184H279.318V48.5184H274.318V48.4184Z'
                                                fill='#010101'
                                            />
                                        </g>
                                        <path
                                            d='M74.2196 32.6625C73.7216 32.1646 72.879 32.1646 72.3811 32.6625L48.8254 56.2182L46.4507 58.5929L32.662 72.3815C32.1641 72.8795 32.1641 73.7221 32.662 74.22C33.1599 74.718 34.0026 74.718 34.5005 74.22L50.6639 58.0566L74.2196 34.501C74.7175 34.0031 74.7175 33.1987 74.2196 32.6625Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M57.2135 43.1963L42.429 57.9808C41.931 58.4788 41.0884 58.4788 40.5905 57.9808C40.0926 57.4829 40.0926 56.6403 40.5905 56.1423L55.375 41.3578C55.8729 40.8599 56.7156 40.8599 57.2135 41.3578C57.7114 41.8557 57.7114 42.6601 57.2135 43.1963Z'
                                            fill='#00A5CB'
                                        />
                                        <path
                                            d='M47.9826 33.2756L33.2363 48.0218C32.7384 48.5198 31.8958 48.5198 31.3979 48.0218C30.8999 47.5239 30.8999 46.6813 31.3979 46.1834L46.1824 31.3988C46.6803 30.9009 47.5229 30.9009 48.0209 31.3988C48.4805 31.9351 48.4805 32.7394 47.9826 33.2756Z'
                                            fill='#00A5CB'
                                        />
                                        <path
                                            d='M39.2115 23.2783L24.427 38.0629C23.9291 38.5608 23.0865 38.5608 22.5885 38.0629C22.0906 37.5649 22.0906 36.7223 22.5885 36.2244L37.3731 21.4398C37.871 20.9419 38.7136 20.9419 39.2115 21.4398C39.7095 21.9378 39.7095 22.7421 39.2115 23.2783Z'
                                            fill='#00A5CB'
                                        />
                                        <path
                                            d='M55.4898 35.1514L46.2591 44.3821C45.7611 44.8801 44.9185 44.8801 44.4206 44.3821C43.9226 43.8842 43.9226 43.0416 44.4206 42.5436L53.6513 33.3129C54.1492 32.815 54.9919 32.815 55.4898 33.3129C55.9877 33.8108 55.9877 34.6535 55.4898 35.1514Z'
                                            fill='#00A5CB'
                                        />
                                        <path
                                            d='M35.5728 36.6846L26.3421 45.9153C25.8441 46.4133 25.0015 46.4133 24.5036 45.9153C24.0056 45.4174 24.0056 44.5748 24.5036 44.0769L33.7343 34.8461C34.2322 34.3482 35.0749 34.3482 35.5728 34.8461C36.0707 35.344 36.0707 36.1484 35.5728 36.6846Z'
                                            fill='#00A5CB'
                                        />
                                        <path
                                            d='M18.3753 25.7678L2.21193 41.8929C1.71401 42.3908 0.871368 42.3908 0.373443 41.8929C-0.124481 41.395 -0.124481 40.5523 0.373443 40.0544L16.5368 23.891C17.0348 23.3931 17.8774 23.3931 18.3753 23.891C18.8732 24.4272 18.8732 25.2316 18.3753 25.7678Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M32.2022 11.9014L22.9715 21.1321C22.4735 21.6301 21.6309 21.6301 21.133 21.1321C20.635 20.6342 20.635 19.7916 21.133 19.2936L30.3637 10.0629C30.8616 9.56497 31.7043 9.56497 32.2022 10.0629C32.7384 10.5608 32.7384 11.4035 32.2022 11.9014Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M41.8925 2.21193L36.8367 7.30608C36.3388 7.80401 35.4961 7.80401 34.9982 7.30608C34.5003 6.80816 34.5003 5.96552 34.9982 5.46759L40.054 0.373443C40.552 -0.124481 41.3946 -0.124481 41.8925 0.373443C42.4288 0.871368 42.4288 1.71401 41.8925 2.21193Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M46.5272 4.96915C46.0292 4.47122 45.1866 4.47122 44.6887 4.96915L33.1981 16.4597L28.4104 21.2474L20.4053 29.2525L4.96963 44.6882C4.47171 45.1861 4.47171 46.0288 4.96963 46.5267C5.46756 47.0246 6.3102 47.0246 6.80812 46.5267L22.2438 31.091L30.2489 23.0859L34.8834 18.4514L34.9217 18.4131L35.0366 18.2982L46.5272 6.80764C47.0251 6.30971 47.0251 5.50537 46.5272 4.96915Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M20.5585 42.0069L11.4426 51.1227C10.9447 51.6206 10.1021 51.6206 9.60416 51.1227C9.10623 50.6248 9.10623 49.7821 9.60416 49.2842L18.72 40.1684C19.2179 39.6704 20.0606 39.6704 20.5585 40.1684C21.0564 40.7046 21.0564 41.5089 20.5585 42.0069Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M51.1235 11.4424L43.1184 19.4475C42.6205 19.9454 41.7779 19.9454 41.2799 19.4475C40.782 18.9496 40.782 18.1069 41.2799 17.609L49.285 9.60391C49.783 9.10599 50.6256 9.10599 51.1235 9.60391C51.6597 10.1018 51.6597 10.9445 51.1235 11.4424Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M55.7579 16.0772L39.5945 32.2406C39.0966 32.7385 38.2539 32.7385 37.756 32.2406C37.2581 31.7426 37.2581 30.9 37.756 30.4021L53.9194 14.2387C54.4173 13.7408 55.26 13.7408 55.7579 14.2387C56.2558 14.7366 56.2558 15.5409 55.7579 16.0772Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M21.9757 49.8213L16.0772 55.7581C15.5792 56.256 14.7366 56.256 14.2387 55.7581C13.7408 55.2602 13.7408 54.4175 14.2387 53.9196L20.1755 47.9828C20.6734 47.4849 21.516 47.4849 22.014 47.9828C22.5119 48.4807 22.5119 49.3234 21.9757 49.8213Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M28.5252 52.5412L20.6734 60.3548C20.1754 60.8528 19.3328 60.8528 18.8349 60.3548C18.3369 59.8569 18.3369 59.0143 18.8349 58.5163L26.6868 50.6645C27.1847 50.1665 28.0273 50.1665 28.5252 50.6645C29.0232 51.2007 29.0232 52.005 28.5252 52.5412Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M60.3541 20.6729L52.5022 28.5248C52.0043 29.0227 51.1617 29.0227 50.6637 28.5248C50.1658 28.0268 50.1658 27.1842 50.6637 26.6863L58.5156 18.8344C59.0135 18.3365 59.8562 18.3365 60.3541 18.8344C60.8903 19.3323 60.8903 20.1749 60.3541 20.6729Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M41.4329 48.8252L25.2696 64.9886C24.7716 65.4865 23.929 65.4865 23.4311 64.9886C22.9331 64.4907 22.9331 63.648 23.4311 63.1501L39.5944 46.9867C40.0924 46.4888 40.935 46.4888 41.4329 46.9867C41.9692 47.4846 41.9692 48.3273 41.4329 48.8252Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M64.9888 25.3076L59.6648 30.6316C59.1669 31.1295 58.3242 31.1295 57.8263 30.6316C57.3284 30.1337 57.3284 29.291 57.8263 28.7931L63.1503 23.4691C63.6482 22.9712 64.4908 22.9712 64.9888 23.4691C65.4867 23.9671 65.4867 24.7714 64.9888 25.3076Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M37.7562 61.7705L29.9043 69.6224C29.4064 70.1203 28.5638 70.1203 28.0658 69.6224C27.5679 69.1245 27.5679 68.2818 28.0658 67.7839L35.9177 59.932C36.4156 59.4341 37.2583 59.4341 37.7562 59.932C38.2541 60.43 38.2541 61.2343 37.7562 61.7705Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M69.585 29.9033L61.9246 37.5637C61.4267 38.0616 60.584 38.0616 60.0861 37.5637C59.5882 37.0658 59.5882 36.2231 60.0861 35.7252L67.7465 28.0648C68.2444 27.5669 69.087 27.5669 69.585 28.0648C70.1212 28.5628 70.1212 29.4054 69.585 29.9033Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M78.8158 39.1358L62.6524 55.2991C62.1544 55.7971 61.3118 55.7971 60.8139 55.2991C60.3159 54.8012 60.3159 53.9586 60.8139 53.4607L76.9773 37.2973C77.4752 36.7993 78.3178 36.7993 78.8158 37.2973C79.352 37.7952 79.352 38.6378 78.8158 39.1358Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M48.3658 69.585L39.135 78.8157C38.6371 79.3137 37.7945 79.3137 37.2965 78.8157C36.7986 78.3178 36.7986 77.4752 37.2965 76.9772L46.5273 67.7465C47.0252 67.2486 47.8679 67.2486 48.3658 67.7465C48.8637 68.2827 48.8637 69.0871 48.3658 69.585Z'
                                            fill='black'
                                        />
                                        <path
                                            d='M58.1711 59.7803L53.0769 64.8744C52.579 65.3724 51.7364 65.3724 51.2384 64.8744C50.7405 64.3765 50.7405 63.5339 51.2384 63.036L56.3326 57.9418C56.8305 57.4439 57.6731 57.4439 58.1711 57.9418C58.7073 58.478 58.7073 59.2824 58.1711 59.7803Z'
                                            fill='black'
                                        />
                                        <defs>
                                            <clipPath id='clip0_1919_16'>
                                                <rect
                                                    width='203.8'
                                                    height='42.5'
                                                    fill='white'
                                                    transform='translate(90.2178 25.2188)'
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo/Brand */}
                    <div className='text-center'>
                        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                            Welcome to Synthia
                        </h1>
                        <p className='text-gray-600'>
                            Digital Customer Experience Platform
                        </p>
                    </div>

                    {/* Login Form */}
                    <Card padding='lg' className='shadow-lg border-gray-200/80'>
                        <form onSubmit={handleLogin} className='space-y-6'>
                            <div className='space-y-4'>
                                <Input
                                    label='Email address'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    placeholder='you@company.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={
                                        error && email === ''
                                            ? 'Email is required'
                                            : undefined
                                    }
                                />

                                <Input
                                    label='Password'
                                    type='password'
                                    autoComplete='current-password'
                                    required
                                    placeholder='••••••••'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    error={
                                        error && password === ''
                                            ? 'Password is required'
                                            : undefined
                                    }
                                />
                            </div>

                            {error && (
                                <div className='bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-down'>
                                    <p className='font-semibold mb-1'>
                                        Authentication failed
                                    </p>
                                    <p className='text-red-600'>{error}</p>
                                </div>
                            )}

                            <Button
                                type='submit'
                                variant='primary'
                                size='lg'
                                className='w-full'
                                isLoading={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </Card>

                    {/* Footer */}
                    <div className='space-y-4'>
                        <p className='text-center text-sm text-gray-500'>
                            Secure authentication powered by Supabase
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Branding/Features */}
            <div className='hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 items-center justify-center relative overflow-hidden'>
                {/* Background Pattern */}
                <div className='absolute inset-0 opacity-10'>
                    <div
                        className='absolute inset-0'
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px',
                        }}
                    ></div>
                </div>

                <div className='relative z-10 max-w-lg text-white space-y-8 animate-fade-in'>
                    <div>
                        <h2 className='text-4xl font-bold mb-4 leading-tight'>
                            Transform Customer Insights with AI
                        </h2>
                        <p className='text-blue-100 text-lg'>
                            Create Digital customer and engage in realistic
                            conversations to understand your audience better.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className='space-y-4'>
                        <div className='flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200'>
                            <div className='shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                <Sparkles className='w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1'>
                                    AI-Powered Customers
                                </h3>
                                <p className='text-sm text-blue-100 leading-relaxed'>
                                    Generate realistic customer with detailed
                                    backgrounds and motivations
                                </p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200'>
                            <div className='shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                <MessageSquare className='w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1'>
                                    Natural Conversations
                                </h3>
                                <p className='text-sm text-blue-100 leading-relaxed'>
                                    Chat with synthetic customers to test
                                    messaging and gather insights
                                </p>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-200'>
                            <div className='shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                                <TrendingUp className='w-5 h-5' />
                            </div>
                            <div>
                                <h3 className='font-semibold mb-1'>
                                    Data-Driven Decisions
                                </h3>
                                <p className='text-sm text-blue-100 leading-relaxed'>
                                    Make informed product and marketing
                                    decisions based on customer feedback
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className='grid grid-cols-3 gap-4 pt-8 border-t border-white/20'>
                        <div>
                            <div className='text-3xl font-bold'>10K+</div>
                            <div className='text-sm text-blue-100'>
                                Conversations
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold'>500+</div>
                            <div className='text-sm text-blue-100'>
                                Personas
                            </div>
                        </div>
                        <div>
                            <div className='text-3xl font-bold'>98%</div>
                            <div className='text-sm text-blue-100'>
                                Accuracy
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
