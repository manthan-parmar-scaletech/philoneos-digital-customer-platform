import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { LogOut } from 'lucide-react';

interface SignOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function SignOutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: SignOutModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Sign Out?' size='sm'>
            <div className='space-y-4'>
                <p className='text-gray-600'>
                    Are you sure you want to sign out? You will need to log in
                    again to access your account.
                </p>

                <div className='flex gap-3 justify-end'>
                    <Button
                        variant='secondary'
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='danger'
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        <LogOut className='w-4 h-4 mr-2' />
                        Sign Out
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
