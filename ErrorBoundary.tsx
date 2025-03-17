import React, { Component, ErrorInfo, ReactNode } from "react";
import { SafeAreaView, Text, View } from "react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <SafeAreaView>
            <View>
              <Text>Something went wrong.</Text>
              <Text>{this.state.error?.toString()}</Text>
            </View>
          </SafeAreaView>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
