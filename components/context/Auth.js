import * as React from 'react';
import SecureStore from '@react-native-async-storage/async-storage';
import {useToast} from 'native-base';
import uilchilgee, {aldaaBarigch, url} from 'lib/uilchilgee';
import useAjiltan from 'hooks/useAjiltan';
import messaging from '@react-native-firebase/messaging';
import useSonorduulga from 'hooks/useSonorduulga';
import useBaiguullaga from 'hooks/useBaiguullaga';
import useData from 'hooks/useData';
import Version from 'components/custom/Version';
import axios from "axios";
const TOPIC = 'MyNews';
export const AuthContext = React.createContext();

export const useSalbar = () => {
  const [salbariinId, setSalbariinId] = React.useState(null);

  React.useEffect(() => {
    SecureStore.getItem('salbariinId', (e, salbariinId) => {
      if (salbariinId) setSalbariinId(salbariinId);
    });
  }, []);

  const salbarSoliyo = id => {
    setSalbariinId(id);
    SecureStore.setItem('salbariinId', id);
  };

  return {salbariinId, salbarSoliyo};
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const unuudriinIrtsAvya = '/unuudriinIrtsAvya';

export default function Auth({children}) {
  const [token, setToken] = React.useState(null);
  const [firebaseToken, setFirebaseToken] = React.useState(null);
  const {salbariinId, salbarSoliyo} = useSalbar();
  const Toast = useToast();
  const {ajiltan, ajiltanMutate} = useAjiltan(token);
  const {baiguullaga} = useBaiguullaga(token, ajiltan?.baiguullagiinId);
  const sonorduulga = useSonorduulga(token, ajiltan?._id);
  // const sonorduulga = useSonorduulga(token, baiguullaga, ajiltan);
  const [huudasTuluv, setHuudasTuluv] = React.useState('1');
  const [irtsBurtgekh, setIrtsBurtgekh] = React.useState(false);
  const unuudriinIrts = useData(token, unuudriinIrtsAvya);

  React.useEffect(() => {
    SecureStore.getItem('token', (e, data) => {
      setToken(data);
      ajiltanMutate();
    });
  }, []);

  React.useEffect(() => {
    if (!!ajiltan && !!firebaseToken) {
      uilchilgee(token).post('/ajiltandTokenOnooyo', {
        id: ajiltan._id,
        token: firebaseToken,
      });
    }
  }, [ajiltan, firebaseToken, token]);

  // console.log('fcmToken',firebaseToken)

  React.useEffect(() => {
    if (requestUserPermission()) {
      /**
       * Returns an FCM token for this device
       */
      messaging()
        .getToken()
        .then(fcmToken => {
          setFirebaseToken(fcmToken);
        });
    } else console.log('Not Authorization status:', authStatus);

    /**
     * When a notification from FCM has triggered the application
     * to open from a quit state, this method will return a
     * `RemoteMessage` containing the notification data, or
     * `null` if the app was opened via another method.
     */
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'getInitialNotification:' +
              'Notification caused app to open from quit state',
          );
          console.log(remoteMessage);
        }
      });

    /**
     * When the user presses a notification displayed via FCM,
     * this listener will be called if the app has opened from
     * a background state. See `getInitialNotification` to see
     * how to watch for when a notification opens the app from
     * a quit state.
     */

    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        Toast.show({
          title: 'Анхаар',
          description: remoteMessage.notification?.body,
          status: 'warning',
        });
      }
    });

    /**
     * Set a message handler function which is called when
     * the app is in the background or terminated. In Android,
     * a headless task is created, allowing you to access the
     * React Native environment to perform tasks such as updating
     * local storage, or sending a network request.
     */
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    /**
     * When any FCM payload is received, the listener callback
     * is called with a `RemoteMessage`. Returns an unsubscribe
     * function to stop listening for new messages.
     */
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      sonorduulga.resetSonorduulga();
      // alert("remoteMessage");
      console.log('remoteMessage', remoteMessage);
    });

    /**
     * Apps can subscribe to a topic, which allows the FCM
     * server to send targeted messages to only those devices
     * subscribed to that topic.
     */
    messaging()
      .subscribeToTopic(TOPIC)
      .then(() => {
        console.log(`Topic: ${TOPIC} Suscribed`);
      });

    return () => {
      unsubscribe();
      /**
       * Unsubscribe the device from a topic.
       */
      // messaging().unsubscribeFromTopic(TOPIC);
    };
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async khereglech => {
        uilchilgee(token)
          .post('/ajiltanNevtrey', khereglech)
          .then(({data}) => {
            setIrtsBurtgekh(data?.irtsBurtgekh);
            SecureStore.setItem('token', data.token);
            setToken(data.token);
            salbarSoliyo(data.result.salbaruud[0]);
          })
          .catch(e => aldaaBarigch(e, Toast));
      },
      signOut: () => {
        SecureStore.removeItem('token');
        setToken(null);
      },
      ajiltan,
      token,
      sonorduulga,
      baiguullaga,
      salbariinId,
      salbarSoliyo,
      huudasTuluv,
      setHuudasTuluv,
      unuudriinIrts,
      irtsBurtgekh,
    }),
    [
      ajiltan,
      token,
      sonorduulga,
      salbariinId,
      baiguullaga,
      huudasTuluv,
      unuudriinIrts,
      irtsBurtgekh,
    ],
  );

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
