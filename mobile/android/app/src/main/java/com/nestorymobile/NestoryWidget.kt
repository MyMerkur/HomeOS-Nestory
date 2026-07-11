package com.nestorymobile

import android.content.Context
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Column
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.padding
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import org.json.JSONObject

private val BackgroundColor = ColorProvider(Color(0xFFF5F1EA))
private val PrimaryColor = ColorProvider(Color(0xFF4B7F52))
private val TextMutedColor = ColorProvider(Color(0xFF6B6B6B))
private val TextDefaultColor = ColorProvider(Color(0xFF1A1A1A))

// Reads the last snapshot the app wrote via NestoryWidgetModule.writeSnapshot —
// this widget has no network access of its own, it only ever shows data as
// fresh as the last time the app's dashboard was opened.
class NestoryWidget : GlanceAppWidget() {
  override suspend fun provideGlance(context: Context, id: GlanceId) {
    val prefs = context.getSharedPreferences(NestoryWidgetModule.WIDGET_PREFS, Context.MODE_PRIVATE)
    val json = prefs.getString(NestoryWidgetModule.WIDGET_DATA_KEY, null)

    provideContent {
      Column(
        modifier =
          GlanceModifier.fillMaxSize().background(BackgroundColor).padding(12.dp),
      ) {
        Text(
          "Nestory",
          style = TextStyle(color = PrimaryColor, fontWeight = FontWeight.Bold, fontSize = 14.sp),
        )

        if (json == null) {
          Text(
            "Uygulamayı açarak senkronize et",
            style = TextStyle(color = TextMutedColor, fontSize = 12.sp),
          )
        } else {
          val data = JSONObject(json)
          val expiringToday = data.optInt("expiringToday", 0)
          Text(
            "$expiringToday ürünün bugün SKT'si doluyor",
            style = TextStyle(color = TextDefaultColor, fontSize = 13.sp),
          )

          val items = data.optJSONArray("upcomingItems")
          if (items != null) {
            for (i in 0 until minOf(items.length(), 3)) {
              val item = items.optJSONObject(i) ?: continue
              Text(
                "• ${item.optString("name")}",
                style = TextStyle(color = TextMutedColor, fontSize = 12.sp),
              )
            }
          }
        }
      }
    }
  }
}
