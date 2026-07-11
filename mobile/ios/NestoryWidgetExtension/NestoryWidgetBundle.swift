import SwiftUI
import WidgetKit

// Reads the last snapshot the app wrote via NestoryWidgetModule.writeSnapshot
// (see ios/NestoryMobile/NestoryWidgetModule.m) into the shared App Group
// container. This widget has no network/auth access of its own — it only
// ever shows data as fresh as the last time the app's dashboard was opened.
private let appGroupId = "group.com.nestoryhomekit.app"
private let widgetDataKey = "widget_data"

private struct NestorySnapshot: Codable {
    struct UpcomingItem: Codable {
        let name: String
    }

    let expiringToday: Int
    let upcomingItems: [UpcomingItem]
}

private func readSnapshot() -> NestorySnapshot? {
    guard
        let defaults = UserDefaults(suiteName: appGroupId),
        let json = defaults.string(forKey: widgetDataKey),
        let data = json.data(using: .utf8)
    else { return nil }
    return try? JSONDecoder().decode(NestorySnapshot.self, from: data)
}

private struct NestoryEntry: TimelineEntry {
    let date: Date
    let snapshot: NestorySnapshot?
}

private struct NestoryTimelineProvider: TimelineProvider {
    func placeholder(in context: Context) -> NestoryEntry {
        NestoryEntry(date: Date(), snapshot: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (NestoryEntry) -> Void) {
        completion(NestoryEntry(date: Date(), snapshot: readSnapshot()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<NestoryEntry>) -> Void) {
        let entry = NestoryEntry(date: Date(), snapshot: readSnapshot())
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date()) ?? Date()
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

private struct NestoryWidgetEntryView: View {
    let entry: NestoryEntry

    private let primaryColor = Color(red: 0.29, green: 0.5, blue: 0.32)
    private let backgroundColor = Color(red: 0.96, green: 0.95, blue: 0.92)

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Nestory")
                .font(.headline)
                .foregroundColor(primaryColor)

            if let snapshot = entry.snapshot {
                Text("\(snapshot.expiringToday) ürünün bugün SKT'si doluyor")
                    .font(.caption)
                    .fixedSize(horizontal: false, vertical: true)

                ForEach(snapshot.upcomingItems.prefix(3), id: \.name) { item in
                    Text("• \(item.name)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            } else {
                Text("Uygulamayı açarak senkronize et")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(backgroundColor)
    }
}

struct NestoryWidget: Widget {
    let kind: String = "NestoryWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: NestoryTimelineProvider()) { entry in
            NestoryWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Nestory")
        .description("Bugün ve yakında son kullanma tarihi dolacak ürünleri gösterir.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

@main
struct NestoryWidgetBundle: WidgetBundle {
    var body: some Widget {
        NestoryWidget()
    }
}
