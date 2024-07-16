import React from 'react';
import styles from './addButton.module.css';

interface AddButtonProps {
  onClickNewAlarm: () => void;
}

export default function AddButton({ onClickNewAlarm }: AddButtonProps) {
  function seeHelp() {
    window.alert('帮助');
  }

  function seeWarning() {
    window.alert('警告');
  }

  return (
    <>
    <div className={styles.floatingContainer}>
      <div className={styles.floatingButton}>+</div>
      <div className={styles.elementContainer}>
        <span className={styles.floatElement} title='新建闹钟' onClick={onClickNewAlarm}>
        <i className={`material-icons ${styles.materialIcons}`} title='新建闹钟'>alarm
        </i>
        </span>
        <span className={styles.floatElement} title='帮助' onClick={seeHelp}>
        <i className={`material-icons ${styles.materialIcons}`} title='帮助'>help
        </i>
        </span>
        <span className={styles.floatElement} title='警告' onClick={seeWarning}>
        <i className={`material-icons ${styles.materialIcons}`} title='警告'>warning
        </i>
        </span>
      </div>
    </div>
  </>
  );
};