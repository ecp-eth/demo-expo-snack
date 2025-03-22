import React from "react";
import {
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  FlatList,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import theme from "../theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Comment } from "./Comment";
import { IndexerAPICommentSchemaType } from "@ecp.eth/sdk/schemas";

type RepliesSectionProps = {
  parentComment?: IndexerAPICommentSchemaType;
  onClose: () => void;
  animatedStyle?: AnimatedStyle<ViewStyle>;
};

export default function RepliesSection({
  parentComment,
  onClose,
  animatedStyle,
}: RepliesSectionProps) {
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          flexDirection: "column",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          backgroundColor: theme.colors.background.default,
          zIndex: 1,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.hr,
          borderStyle: "solid",
        }}
      >
        <TouchableOpacity onPress={onClose} hitSlop={20}>
          <View
            style={{
              display: "flex",
              flexGrow: 0,
              flexShrink: 0,
              justifyContent: "center",
              alignItems: "center",
              width: 40,
              height: 40,
              // backgroundColor: "red",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </View>
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          Replies
        </Text>
      </View>
      <View>
        {/* <FlatList
          keyboardShouldPersistTaps="handled"
          // data={allComments}
          renderItem={({ item }) => (
            <Comment
              comment={item}
              onReply={onReply}
              onViewReplies={handleViewReplies}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <ActivityIndicator /> : null
          }
        /> */}
      </View>
    </Animated.View>
  );
}
