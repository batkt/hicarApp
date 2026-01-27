import VersionCheck from 'react-native-version-check';
import {Linking} from 'react-native';
import React from 'react';
import {AlertDialog, Button, useDisclose} from 'native-base';
function Version({children}) {
  const {isOpen, onClose, onOpen} = useDisclose();
  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    VersionCheck.needUpdate().then(res => {
      if (res.isNeeded) {
        onOpen();
      }
    });
  });

  function update() {
    VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded) {
        Linking.openURL(res.storeUrl); // open store if update is needed.
      }
    });
    onClose();
  }

  return (
    <React.Fragment>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Мэдэгдэл</AlertDialog.Header>
          <AlertDialog.Body>
            Аппын шинэ хувилбар гарсан байна та татах уу
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                Үгүй
              </Button>
              <Button colorScheme="blue" onPress={update}>
                Тийм
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      {children}
    </React.Fragment>
  );
}

export default Version;
