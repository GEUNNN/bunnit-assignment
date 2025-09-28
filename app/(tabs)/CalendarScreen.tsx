import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated";

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  date: Date;
}

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isWeekView, setIsWeekView] = useState<boolean>(false);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = useMemo(() => new Date(), []);

  const calendarHeight = useSharedValue(300);
  const translationY = useSharedValue(0);

  const calendarData = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();

    const daysInMonth = lastDay.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const calendarDays: CalendarDay[] = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // 현재 월의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // 다음 월의 날짜들 (달력 그리드 채우기용)
    const remainingSlots = 35 - calendarDays.length;
    for (let day = 1; day <= remainingSlots; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return calendarDays;
  }, [currentDate]);

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const goToPreviousMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = (): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDatePress = (dateInfo: CalendarDay): void => {
    if (dateInfo.isCurrentMonth) {
      setSelectedDate(dateInfo.date);
    }
  };

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getDayTextStyle = (dateInfo: CalendarDay, index: number) => {
    let style = [];

    if (!dateInfo.isCurrentMonth) {
      style.push(styles.inactiveDayText);
    } else {
      if (isSelected(dateInfo.date)) {
        style.push(styles.selectedText);
      } else {
        // 주말 색상
        if (index % 7 === 0) {
          style.push(styles.sundayText);
        } else if (index % 7 === 6) {
          style.push(styles.saturdayText);
        }
      }
    }

    return style;
  };

  const getDayItemStyle = (dateInfo: CalendarDay) => {
    let style = [];

    if (isSelected(dateInfo.date)) {
      style.push(styles.selectedItem);
    }

    return style;
  };

  const handleGesture = Gesture.Pan()
    .onStart(() => {
      translationY.value = 0;
    })
    .onUpdate((e) => {
      translationY.value = e.translationY;
    })
    .onEnd(() => {
      if (translationY.value < -50) {
        runOnJS(setIsWeekView)(false);
        calendarHeight.value = withTiming(300, { duration: 300 });
      } else if (translationY.value > 50) {
        runOnJS(setIsWeekView)(true);
        calendarHeight.value = withTiming(70, { duration: 300 });
      }
    });

  const getWeekData = () => {
    const weeks = [];
    for (let i = 0; i < calendarData.length; i += 7) {
      weeks.push(calendarData.slice(i, i + 7));
    }
    return weeks;
  };

  const getTodayWeek = () => {
    const weeks = getWeekData();
    const todayWeek = weeks.find((week) =>
      week.some(
        (day) =>
          day.isCurrentMonth && day.date.toDateString() === today.toDateString()
      )
    );
    return todayWeek || weeks[0];
  };

  const displayData = isWeekView ? getTodayWeek() : calendarData;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.monthYear}>{monthYear}</Text>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={day} style={styles.weekDayItem}>
            <Text
              style={[
                styles.weekDayText,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      <GestureDetector gesture={handleGesture}>
        <View style={styles.calendarGrid}>
          {displayData.map((dateInfo, index) => (
            <TouchableOpacity
              key={`${dateInfo.date.getTime()}`}
              style={styles.dayContainer}
              onPress={() => handleDatePress(dateInfo)}
              disabled={!dateInfo.isCurrentMonth}
            >
              <View style={getDayItemStyle(dateInfo)}>
                <Text style={getDayTextStyle(dateInfo, index)}>
                  {dateInfo.day}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  weekDaysContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  weekDayItem: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  sundayText: {
    color: "#FF3B30",
  },
  saturdayText: {
    color: "#007AFF",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
  },
  dayContainer: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayItem: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17.5,
  },
  selectedItem: {
    backgroundColor: "#007AFF",
    borderRadius: 100,
  },
  dayText: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "400",
  },
  inactiveDayText: {
    color: "#C7C7CC",
  },
  todayText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  selectedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 5,
  },
  activeNavItem: {},
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
    color: "#8E8E93",
    fontWeight: "500",
  },
  activeNavLabel: {
    color: "#000000",
    fontWeight: "600",
  },
});
