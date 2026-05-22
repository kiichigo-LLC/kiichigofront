import { PageWarning } from "@/components/site/PageWarning";
import { themeAsset } from "@/lib/config";

type Props = {
  pageTitle: string;
};

export function DxContent({ pageTitle }: Props) {
  return (
    <div className="dx elm">
      <div className="dx-inr elm-inr">
        <h1 className="dx-title elm-ttl">
          <span>{pageTitle}</span>
        </h1>

        <div className="dx-main">
          <div className="dx-main-section">
            <h2>DX推進方針について</h2>
            <div className="dx-main-text">
              <h3>
                経営ビジョン及び<br className="nonepc" />ビジネスモデルの方向性
              </h3>
              当社（合同会社キイチゴ）は、多様化するデジタル技術の進化やデータ活用の進展が、中小企業の競争環境に劇的な変化をもたらしていると認識しています。この環境変化に対応するため、当社は単なるWeb制作にとどまらず、
              <b>
                「データとデジタル技術を徹底活用し、業務の非効率・属人化を解消する超効率化モデル」
              </b>
              へと自社のビジネスモデルを変革します。<br />
              自社が実践して得たノウハウや成功事例をアセット（強み）化し、Web活用、業務設計、システム導入支援を通じてクライアント企業の生産性向上と競争力強化に貢献する、次世代型のデジタルパートナーを目指します。
            </div>
          </div>

          <div className="dx-main-section">
            <h2>
              DX戦略<small>(データ・デジタル技術の活用方策)</small>について
            </h2>
            <div className="dx-main-text">
              当社は、上記の経営ビジョンを実現するため、以下のデータ・デジタル技術の活用戦略を推進します。<br /><br />
              <b>1. 自社データの収集と一元管理（何をするか）</b><br />
              各案件における進行データ、問い合わせ・商談データ、クライアント企業のECサイト等のマーケティングアナリティクスデータを、CRMツール（HubSpot等）やデータベース（MySQL等）を用いて一元的に収集・蓄積します。<br /><br />
              <b>2. データの分析と利活用（どのように活用するか）</b><br />
              蓄積された業務フローデータやアクセス解析データを定期的に分析し、手作業や属人化しているプロセスのボトルネックを抽出します。<br /><br />
              <b>3. データ活用によって実現したい変革（目的）</b><br />
              分析結果に基づき、Next.js等のモダンなフロントエンド技術やCMS（WordPress等）の最適化、API連携による自動化を自社およびクライアント向けに実装します。これにより、自社の
              <b>
                「制作・開発プロセスの工数30%削減」と、クライアントの「データドリブンなマーケティング分析による成約率向上」
              </b>
              という変革を同時に達成します。
            </div>
          </div>

          <div className="dx-main-section">
            <h2>DX推進体制、人材の育成・確保について</h2>
            <div className="dx-main-text">
              <h3>DX推進体制・組織</h3>
              当社では、代表者がDX推進の責任者（CDO）として、事業方針の策定、ITシステム投資、および各プロジェクトにおける改善方針の決定を一貫して主導する体制を構築しています。<br /><br />
              <h3>人材の育成・確保に関する事項</h3>
              変化の激しいデジタル技術に対応するため、代表自らが最新のフロントエンド技術（Next.js等）、バックエンド（MySQL/CMS構築）、およびマーケティング分析に関するスキルアップ（外部研修・リスキリング）を継続的に実施します。これにより、課題定義からデジタル実装までをワンストップで遂行できる高度なDX人材としての能力を維持・確保します。
            </div>
          </div>

          <div className="dx-main-section">
            <h2>ITシステム環境の整備に向けた方策について</h2>
            <div className="dx-main-text">
              当社は、DX戦略を安定的かつ迅速に実行するため、以下のITシステム環境の整備を進めます。
              <ol>
                <li>
                  <b>クラウドファーストのインフラ構築</b><br />
                  柔軟で拡張性の高いサーバー環境やCMS環境、安全なSFTP等によるセキュアな開発環境を整備します。
                </li>
                <li>
                  <b>データ連携基盤の導入</b><br />
                  CRMツールや業務自動化ツール、各種APIを連携させ、情報がサイロ化（孤立）しないデータ連携基盤を構築します。
                </li>
                <li>
                  <b>情報セキュリティの徹底</b><br />
                  業務端末のパスワード管理、適切なアクセス権限管理、クラウドサービスの安全な運用など、取り扱う情報の重要性に応じたデータ管理を行い、安全なシステム環境を維持します。
                </li>
              </ol>
            </div>
          </div>

          <div className="dx-main-section">
            <h2>
              DX戦略の達成度を測る指標<small>(KPI)</small>について
            </h2>
            <div className="dx-main-text">
              当社では、DX戦略の達成状況を客観的に評価するため、以下のデータ活用に紐づく指標（KPI）を設定し、定期的に測定・評価を行います。<br /><br />
              <b>1. 業務効率化指標</b><br />
              自社開発・運用におけるデータ自動連携・自動化による、年間総作業時間の削減率（目標: 20%削減）<br />
              <b>2. 顧客成果指標</b><br />
              データドリブンなWeb施策支援による、クライアントのWebサイト問い合わせ数および成約率の向上<br />
              <b>3. デジタル施策実施数</b><br />
              新たなデータ活用ツール、または自動化施策の年間導入件数
            </div>
          </div>

          <div className="dx-main-section">
            <h2>DX推進に係る独自の課題把握について</h2>
            <div className="dx-main-text">
              当社では、デジタル技術の動向や自社のITシステムの現状を踏まえ、経営者がリーダーシップを発揮して定期的に「DX推進指標」に基づく自己診断を実施し、自社の課題を客観的に把握・分析しています。把握した課題は、随時DX戦略やITシステム環境の整備計画へと反映し、継続的な改善を図ります。
            </div>
          </div>

          <div className="dx-main-section">
            <h2>情報発信について</h2>
            <div className="dx-main-text">
              当社は、「デジタル技術とマーケティング分析の融合により、小規模事業者および中小企業のビジネス基盤を強固にし、持続可能な成長に伴走する」という経営ビジョンのもと、DXを推進しています。<br />
              本方針の策定および発信にあたっては、経営者が全面的に監修し、責任を持って対外的にコミットしています。<br /><br />
              <p className="dx-main-text-signature">
                2026年5月22日（改定）<br />
                合同会社キイチゴ<br />
                代表社員　五野上貴一
              </p>
            </div>
          </div>

          <div className="dx-main-section">
            <img
              src={themeAsset("img/dx/security_action.svg")}
              alt="SECURITY ACTION ロゴ"
              className="dx-security_action"
            />
          </div>
        </div>

        <PageWarning />
      </div>
    </div>
  );
}
