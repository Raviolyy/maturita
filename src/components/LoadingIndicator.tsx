import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {ALERT_TYPE, AlertNotificationRoot, Toast} from "react-native-alert-notification";

interface LoadingIndicatorProps {
    isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading }) => {
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isLoading) {
            timer = setTimeout(() => {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Špatné připojení k síti',
                    textBody: 'Zkontorlujte zda jste připojení k síti.',
                });
            }, 7000);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isLoading]);

    if (isLoading) {
        return (
            <AlertNotificationRoot>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </AlertNotificationRoot>
        );
    }

    return null;
};

export default LoadingIndicator;