package com.nestorymobile

import android.content.Context
import androidx.glance.appwidget.updateAll
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

// Bridges dashboard summary data from JS into the shared storage the
// Glance home screen widget (NestoryWidget.kt) reads from. The widget has
// no network/auth access of its own — it only ever shows the last snapshot
// the app wrote, refreshed whenever the dashboard loads successfully.
class NestoryWidgetModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "NestoryWidget"

  @ReactMethod
  fun writeSnapshot(json: String) {
    val prefs =
      reactApplicationContext.getSharedPreferences(WIDGET_PREFS, Context.MODE_PRIVATE)
    prefs.edit().putString(WIDGET_DATA_KEY, json).apply()

    CoroutineScope(Dispatchers.Main).launch {
      NestoryWidget().updateAll(reactApplicationContext)
    }
  }

  companion object {
    const val WIDGET_PREFS = "nestory_widget_prefs"
    const val WIDGET_DATA_KEY = "widget_data"
  }
}
