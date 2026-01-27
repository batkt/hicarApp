import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {Dimensions, PermissionsAndroid, Platform, View} from 'react-native';
import React, {Component} from 'react';

import {Box, Icon, Pressable, Text} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'rn-fetch-blob';
const screenWidth = Dimensions.get('screen').width;

async function internalUriCreator(fileRemoteUrl) {
  // could be 'mp3' or 'aac', etc...
  const fileExtension = 'mp4';

  const dir = RNFetchBlob.fs.dirs.DocumentDir;
  const path = `${dir}/${'fileRemoteUrl'}.${fileExtension}`;

  const res = await RNFetchBlob.config({
    fileCache: false,
    appendExt: fileExtension,
    path,
  }).fetch('GET', fileRemoteUrl);

  const internalUrl = `${
      Platform.OS === 'android' ? 'file://' : ''
  }${res.path()}`;
  return internalUrl;
}

class Page extends Component {
  audioRecorderPlayer;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      isPlaying: false,
      isRecording: false,
      disablePlay: false,
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
    this.clearAllData = this.clearAllData.bind(this);
  }

  /*componentDidUpdate(prevProps) {
    if (!this.props.externalUrl) {
      this.state.disablePlay = true;
      this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
    }
  }
*/
  clearAllData(){
    this.setState({
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      isPlaying: false,
      isRecording: false,
      disablePlay: false,});
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  }

  render() {
    let playWidth =
        (this.state.currentPositionSec / this.state.currentDurationSec) *
        (screenWidth - 220);

    if (!playWidth) {
      playWidth = 0;
    }

    return (
        <Box
            p={5}
            bg="gray.100"
            rounded={'xl'}
            flexDirection={this.props.externalUrl ? 'row-reverse' : 'row'}
            alignItems={'center'}>
          {
            this.props.turul==="burtgeh" ?
                <Pressable
                    rounded={'full'}
                    w="12"
                    h="12"
                    bg="blue.50"
                    _pressed={{bg: 'blue.100'}}
                    onPress={
                      !!this.state.isRecording
                          ? this.onStopRecord
                          : this.onStartRecord
                    }
                    alignItems={'center'}
                    justifyContent="center">
                  <Icon
                      size="md"
                      as={
                        <MaterialIcons name={!!this.state.isRecording ? 'stop' : 'mic'} />
                      }
                  />
                </Pressable>
                :
                <Pressable
                    disabled={this.state.disablePlay}
                    rounded={'full'}
                    w="12"
                    h="12"
                    bg="blue.50"
                    _pressed={{bg: 'blue.100'}}
                    onPress={this.state.isPlaying ? this.onPausePlay : this.onStartPlay}
                    alignItems={'center'}
                    justifyContent="center">
                  <Icon
                      size="md"
                      as={
                        <MaterialIcons
                            name={this.state.isPlaying ? 'pause' : 'play-arrow'}
                        />
                      }
                  />
                </Pressable>
          }
          <Box px="5">
            <Box>
              <Text bold fontSize={'sm'} color="gray.600">
                Voice
              </Text>
              <View
                  style={{
                    backgroundColor: '#ccc',
                    height: 4,
                    alignSelf: 'stretch',
                    width: screenWidth - 220,
                  }}>
                <View
                    style={{backgroundColor: 'white', height: 4, width: playWidth}}
                />
              </View>
              <Text>
                {this.state.playTime} / {this.state.duration}
              </Text>
            </Box>
          </Box>
        </Box>
    );
  }

  onStatusPress = e => {
    const touchX = e.nativeEvent.locationX;
    // console.log(`touchX: ${touchX}`);
    const playWidth =
        (this.state.currentPositionSec / this.state.currentDurationSec) *
        (screenWidth - 56);
    // console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(this.state.currentPositionSec);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      this.audioRecorderPlayer.seekToPlayer(addSecs);
      // console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      this.audioRecorderPlayer.seekToPlayer(subSecs);
      // console.log(`subSecs: ${subSecs}`);
    }
  };

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        // console.log('write external stroage', grants);

        if (
            grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
            grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          // console.log('permissions granted');
        } else {
          // console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const uri = await this.audioRecorderPlayer.startRecorder(
        undefined,
        audioSet,
    );

    this.setState({
      isRecording: true,
    });

    this.audioRecorderPlayer.addRecordBackListener(e => {
      // console.log('record-back', e);
      this.setState({
        recordSecs: e.currentPosition,
        recordTime: this.audioRecorderPlayer.mmssss(
            Math.floor(e.currentPosition),
        ),
        playTime: '00:00:00',
        duration: this.audioRecorderPlayer.mmssss(
            Math.floor(e.currentPosition),
        ),
      });
    });
    // console.log(`uri: ${uri}`);
  };

  onPauseRecord = async () => {
    try {
      await this.audioRecorderPlayer.pauseRecorder();
    } catch (err) {
      // console.log('pauseRecord', err);
    }
  };

  onResumeRecord = async () => {
    await this.audioRecorderPlayer.resumeRecorder();
  };

  onStopRecord = async () => {
    this.setState({
      recordSecs: 0,
      isRecording: false,
    });
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.props.onChange && this.props.onChange(result);
  };

  onStartPlay = async () => {
    console.log('onStartPlay', this.props.externalUrl);
    //? Custom path
    // const msg = await this.audioRecorderPlayer.startPlayer(this.path);
    //? Default path
    let msg = null;
    if (this.props.externalUrl) {
      const internalUri = await internalUriCreator(this.props.externalUrl);
      console.log('this.props.externalUrl', this.props.externalUrl, 'internalUri ', internalUri);
      msg = await this.audioRecorderPlayer.startPlayer(internalUri);
    } else msg = await this.audioRecorderPlayer.startPlayer();
    const volume = await this.audioRecorderPlayer.setVolume(1.0);
    // console.log(`file: ${msg}`, `volume: ${volume}`);
    this.setState({
      isPlaying: true,
    });

    this.audioRecorderPlayer.addPlayBackListener(e => {
      this.setState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
            Math.floor(e.currentPosition),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      if (e.currentPosition === e.duration) {
        this.setState({
          isPlaying: false,
        });
        this.onStopPlay();
      }
    });
  };

  onPausePlay = async () => {
    this.setState({
      isPlaying: false,
    });
    await this.audioRecorderPlayer.pausePlayer();
  };

  onResumePlay = async () => {
    await this.audioRecorderPlayer.resumePlayer();
  };

  onStopPlay = async () => {
    // console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
}

export default Page;
