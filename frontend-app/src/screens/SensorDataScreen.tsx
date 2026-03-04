import React from "react";
import { Switch, Text, View } from "react-native";
import ScreenScrollView from "../components/ScreenScrollView";
import { useStore } from "../store";
import globalStyles from "../styles/global.styles";
import s from "../styles/sensorData.styles";
import theme from "../theme/theme";
import type { BottomTabScreenProps } from "../types/navigation";

function fmt(n: number | null | undefined, decimals = 4): string {
  if (n == null) return "—";
  return n.toFixed(decimals);
}

function ts(timestamp: number | undefined): string {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleTimeString();
}

function StatusDot({ on }: { on: boolean }) {
  return (
    <View
      style={[
        s.statusDot,
        { backgroundColor: on ? theme.colors.success : theme.colors.muted },
      ]}
    />
  );
}

function Toggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={s.toggleRow}>
      <Text style={s.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? theme.colors.primary : theme.colors.muted}
      />
    </View>
  );
}

const SensorDataScreen: React.FC<BottomTabScreenProps<"SensorData">> = () => {
  const {
    state,
    setSensorEnabled,
    setBackgroundLocationEnabled,
    setBackgroundSensorsEnabled,
  } = useStore();
  const { sensors } = state;
  const { location, accelerometer, microphone } = sensors;

  const locationOn = sensors.enabled.location || sensors.backgroundLocationEnabled;
  const accelOn = sensors.enabled.accelerometer || sensors.backgroundSensorsEnabled;
  const micOn = sensors.enabled.microphone || sensors.backgroundSensorsEnabled;

  return (
    <ScreenScrollView
      accessibilityLabel="Sensor data screen"
      contentContainerStyle={s.content}
    >
      <Text style={globalStyles.heading}>Sensor Data</Text>

      {/* ---- Controls ---- */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Controls</Text>
        <Toggle
          label="Location (foreground)"
          value={sensors.enabled.location}
          onValueChange={(v) => setSensorEnabled("location", v)}
        />
        <Toggle
          label="Background Location"
          value={sensors.backgroundLocationEnabled}
          onValueChange={setBackgroundLocationEnabled}
        />
        <Toggle
          label="Accelerometer"
          value={sensors.enabled.accelerometer}
          onValueChange={(v) => setSensorEnabled("accelerometer", v)}
        />
        <Toggle
          label="Microphone"
          value={sensors.enabled.microphone}
          onValueChange={(v) => setSensorEnabled("microphone", v)}
        />
        <Toggle
          label="Background Sensors (accel+mic)"
          value={sensors.backgroundSensorsEnabled}
          onValueChange={setBackgroundSensorsEnabled}
        />
      </View>

      {/* ---- Location ---- */}
      <View style={s.card}>
        <View style={s.statusRow}>
          <StatusDot on={locationOn} />
          <Text style={s.cardTitle}>Location (GPS)</Text>
        </View>

        {location ? (
          <>
            <Row label="Latitude" value={fmt(location.latitude, 6)} />
            <Row label="Longitude" value={fmt(location.longitude, 6)} />
            <Row label="Altitude" value={fmt(location.altitude, 1)} />
            <Row label="Accuracy" value={`${fmt(location.accuracy, 1)} m`} />
            <Row label="Speed" value={fmt(location.speed, 2)} />
            <Row label="Heading" value={fmt(location.heading, 1)} />
            <Row label="Updated" value={ts(location.timestamp)} />
          </>
        ) : (
          <Text style={s.label}>No data yet — enable location above</Text>
        )}
        {sensors.errors.location ? (
          <Text style={s.error}>{sensors.errors.location}</Text>
        ) : null}
      </View>

      {/* ---- Accelerometer ---- */}
      <View style={s.card}>
        <View style={s.statusRow}>
          <StatusDot on={accelOn} />
          <Text style={s.cardTitle}>Accelerometer</Text>
        </View>

        {accelerometer ? (
          <>
            <Row label="X" value={fmt(accelerometer.x)} />
            <Row label="Y" value={fmt(accelerometer.y)} />
            <Row label="Z" value={fmt(accelerometer.z)} />
            <Row label="Updated" value={ts(accelerometer.timestamp)} />
          </>
        ) : (
          <Text style={s.label}>No data yet — enable accelerometer above</Text>
        )}
        {sensors.errors.accelerometer ? (
          <Text style={s.error}>{sensors.errors.accelerometer}</Text>
        ) : null}
      </View>

      {/* ---- Microphone ---- */}
      <View style={s.card}>
        <View style={s.statusRow}>
          <StatusDot on={micOn} />
          <Text style={s.cardTitle}>Microphone</Text>
        </View>

        {microphone ? (
          <>
            <Row label="Recording" value={microphone.isRecording ? "Yes" : "No"} />
            <Row
              label="Metering (dB)"
              value={microphone.meteringDb != null ? fmt(microphone.meteringDb, 1) : "—"}
            />
            <Row label="Updated" value={ts(microphone.timestamp)} />
          </>
        ) : (
          <Text style={s.label}>No data yet — enable microphone above</Text>
        )}
        {sensors.errors.microphone ? (
          <Text style={s.error}>{sensors.errors.microphone}</Text>
        ) : null}
      </View>

      {/* ---- Permissions summary ---- */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Permissions</Text>
        <Row label="Location" value={sensors.permissions.location} />
        <Row label="Microphone" value={sensors.permissions.microphone} />
      </View>
    </ScreenScrollView>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

export default SensorDataScreen;
