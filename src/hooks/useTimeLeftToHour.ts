import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, writeBatch, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';

interface UseTimeLeftToHourOptions {
  onTimeEnd?: () => void;             // 정각 도달 시 (감정 팝업 등)
  onAutoExit?: () => void;            // 자동 퇴장 (10초 후 실행)
  autoExitDelayMs?: number;           // 자동 퇴장 대기 시간
  roomYear?: string;                  // 삭제할 채팅방 연도
}

export function useTimeLeftToHour({
  onTimeEnd,
  onAutoExit,
  autoExitDelayMs = 10000,
  roomYear,
}: UseTimeLeftToHourOptions = {}) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const hasTriggeredRef = useRef(false);
  const autoExitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ⏱ 남은 시간 계산
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      const diff = Math.floor((nextHour.getTime() - now.getTime()) / 1000);
      setSecondsLeft(diff);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // ⏳ 정각 도달 시 동작
  useEffect(() => {
    if (
      secondsLeft !== null &&
      secondsLeft <= 0 &&
      !hasTriggeredRef.current
    ) {
      hasTriggeredRef.current = true;

      if (onTimeEnd) onTimeEnd();

      // ✅ 감정 팝업 후 일정 시간 뒤 자동 퇴장
      if (onAutoExit) {
        autoExitTimeoutRef.current = setTimeout(() => {
          onAutoExit();
        }, autoExitDelayMs);
      }

      // ✅ Firestore 메시지 초기화
      if (roomYear) {
        const clearMessages = async () => {
          try {
            const ref = collection(db, 'chatrooms', roomYear, 'messages');
            const snapshot = await getDocs(ref);
            const batch = writeBatch(db);
            snapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });
            await batch.commit();

            // 🟦 시스템 메시지로 초기화 로그 기록
            await addDoc(ref, {
              text: `💫 ${roomYear}년 채팅방 메시지가 정각에 초기화되었습니다.`,
              sender: 'system',
              timestamp: serverTimestamp(),
            });
          } catch (err) {
            console.error('메시지 삭제 실패:', err);
          }
        };
        clearMessages();
      }
    }
  }, [secondsLeft, onTimeEnd, onAutoExit, autoExitDelayMs, roomYear]);

  useEffect(() => {
    return () => {
      if (autoExitTimeoutRef.current) {
        clearTimeout(autoExitTimeoutRef.current);
      }
    };
  }, []);

  return {
    secondsLeft: secondsLeft ?? 0,
    minutes: Math.floor((secondsLeft ?? 0) / 60),
    seconds: (secondsLeft ?? 0) % 60,
  };
}
