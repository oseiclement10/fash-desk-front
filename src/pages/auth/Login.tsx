import React, { useContext, useState } from 'react';
import { Shield, Lock, Mail } from 'lucide-react';
import { AuthContext } from '@/contexts/auth/auth-context';
import { saveUserToStorage } from '@/services/storageService';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Checkbox, Spin } from 'antd';
import type { AuthUser } from '@/@types/users';
import type { RequestError } from '@/@types/error';
import { parseApiError } from '@/utils/parse-api-errors';
import { postHelper } from '@/services/apiService';
import { FormConfig } from '@/components/crud/form-config';
import FormErrorAlert from '@/components/crud/form-error-alert';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '@/routes';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoImg } from '@/components/appLogo';
import { LoadingOutlined } from "@ant-design/icons";
import { appConfig } from '@/config/meta';

type FormFields = {
    email?: string;
    password?: string;
    remember?: boolean;
};

const LoginPage: React.FC = () => {
    const [form] = Form.useForm();
    const { addUser } = useContext(AuthContext);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const { isPending, mutate, error } = useMutation({
        mutationFn: (data: FormFields) => postHelper('login', data),
        onSuccess: (userData: AuthUser) => {
            saveUserToStorage(userData);
            addUser(userData);
            navigate(appRoutes.dashboard.path);
        },
        onError: () => setShowError(true),
    });

    return (
        <div className="min-h-screen bg-[#0F172A] lg:bg-linear-to-br lg:from-gray-50 lg:to-gray-100 flex items-center justify-center p-4 font-poppins">
            <div className="w-full max-w-6xl flex rounded-3xl overflow-hidden shadow-2xl bg-white">

                <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-[#020617] via-[#0F172A] to-[#020617] p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -top-32 -left-32 w-72 h-72 bg-[#C9A24D] rounded-full" />
                        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#C9A24D] rounded-full" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full">

                        {/* Brand Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-4"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                                <LogoImg className="w-10" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-wide">
                                    {appConfig.name}
                                </h1>
                                <p className="text-sm text-primary">
                                    Fashion  Management System
                                </p>
                            </div>
                        </motion.div>

                        {/* Hero Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-20"
                        >
                            <h2 className="text-5xl font-extrabold leading-tight mb-6">
                                Manage Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    Fashion Business Seamlessly
                                </span>
                            </h2>

                            <p className="text-gray-300 text-lg max-w-lg">
                                Streamline operations, track production, manage clients,
                                and gain real-time insights — all from one powerful dashboard.
                            </p>
                        </motion.div>

                        {/* Core Features */}
                        <div className="space-y-4 mt-12">
                            {[
                                'Client & Order Management',
                                'Measurement & Tailoring Records',
                                'Production Workflow Monitoring',
                                'Sales & Revenue Reports',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-primary/80 rounded-full" />
                                    <span className="text-gray-300">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-8 border-t border-white/10 text-sm text-gray-400">
                            © {new Date().getFullYear()} {appConfig.name} |{' '}
                            <a
                                className="text-secondary text-[10px]"
                                href="https://oactechhub.com"
                            >
                                BY OAC TECH HUB
                            </a>
                        </div>
                    </div>
                </div>

                {/* RIGHT – LOGIN */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <div className=" hidden  lg:inline-flex items-center justify-center w-16 h-16 bg-primary/15 rounded-2xl mb-6">
                                <Lock className="w-8 h-8 text-secondary" />
                            </div>
                            <div className="w-14 lg:hidden h-14 bg-linear-to-br from-[#000000] to-[#0a0700] rounded-xl flex items-center justify-center shadow-lg">
                                <LogoImg className='w-64' />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Sign in to {appConfig.name}
                            </p>
                        </div>

                        <FormConfig>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={mutate}
                                onFieldsChange={() => setShowError(false)}
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Email is required' },
                                        { type: 'email', message: 'Invalid email address' },
                                    ]}
                                >
                                    <Input
                                        size="large"
                                        placeholder='enter email, johndoe@gmail.com'
                                        prefix={<Mail className="w-4 h-4 text-gray-400" />}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Password is required' }]}
                                >
                                    <Input.Password
                                        size="large"
                                        prefix={<Lock className="w-4 h-4 text-gray-400" />}
                                        placeholder='password here '
                                    />
                                </Form.Item>

                                <div className="flex justify-between mb-4">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>
                                </div>

                                <AnimatePresence>
                                    {showError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <FormErrorAlert
                                                message={parseApiError(error as RequestError)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`
    w-full mt-6  py-4 rounded-xl font-semibold
    flex items-center justify-center gap-3
    transition-all duration-300
    ${isPending
                                            ? 'bg-secondary text-primary-foreground cursor-not-allowed'
                                            : 'bg-secondary text-primary-foreground cursor-pointer hover:shadow-lg hover:shadow-[#F5E6C8] hover:scale-[1.01] active:scale-[0.98]'
                                        }
  `}
                                >
                                    {isPending && (
                                        <Spin
                                            size="small"
                                            indicator={
                                                <LoadingOutlined
                                                    className="!text-primary-foreground"
                                                    spin
                                                />
                                            }
                                        />
                                    )}

                                    <span className="tracking-wide">
                                        {isPending ? 'Signing in…' : 'Sign In'}
                                    </span>
                                </button>

                            </Form>
                        </FormConfig>

                        <div className="mt-8 p-4 rounded-xl bg-primary/30 border border-primary/60">
                            <div className="flex gap-3">
                                <Shield className="w-5 h-5 text-primary" />
                                <p className="text-sm text-gray-700">
                                    Secure, encrypted access to {appConfig.name} systems.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
