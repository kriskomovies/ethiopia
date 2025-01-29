import { ReactNode, useEffect, useState, useRef, FC } from 'react';
import InfoBox from '@/components/info-box/info-box';
import { QRCodeSVG } from 'qrcode.react';
import ValueWithCopyIcon from '@/components/value-with-copy-icon/value-with-copy-icon';
import { useAppSelector } from '@/redux/store';
import {
  useGetUserByIdQuery,
  useGetUserMembersQuery,
} from '@/redux/services/users.service';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CircleHelp } from 'lucide-react';
import Tree from 'react-d3-tree';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';

// Custom node component for the tree
const CustomNode: FC<any> = ({ nodeDatum }) => (
  <g>
    <foreignObject
      x="-150"
      y={nodeDatum.name === 'You' ? '-80' : '-50'}
      width="300"
      height={nodeDatum.name === 'You' ? '140' : '120'}
      style={{ overflow: 'visible' }}
    >
      <div
        className={`p-4 backdrop-blur-sm rounded-xl border shadow-lg hover:border-white/30 transition-all
        ${
          nodeDatum.name === 'You'
            ? 'bg-blue-500/20 border-blue-500/50'
            : 'bg-black/40 border-white/10'
        }`}
      >
        <div className="space-y-1.5 text-left">
          <h3
            className={`font-medium text-lg ${
              nodeDatum.name === 'You' ? 'text-blue-400' : 'text-white'
            }`}
          >
            {nodeDatum.name}
          </h3>
          <div className="space-y-1 text-sm">
            <div className="text-white/80">Balance: ${nodeDatum.balance}</div>
            <div className="text-white/80">Status: {nodeDatum.status}</div>
            <div className="text-white/80">Joined: {nodeDatum.joinedDate}</div>
          </div>
        </div>
      </div>
    </foreignObject>
    {nodeDatum.name === 'You' ? (
      <circle r="1" fill="white" cy="60" />
    ) : (
      <circle r="1" fill="white" cy="-50" />
    )}
  </g>
);

const TeamPage = (): ReactNode => {
  const dispatch = useDispatch();
  const { id } = useAppSelector((state) => state.appState.user);
  const { data: userData } = useGetUserByIdQuery({ id: id }, { skip: !id });
  const { data, isLoading } = useGetUserMembersQuery({ id }, { skip: !id });
  const [treeData, setTreeData] = useState<any[]>([]);
  // Add state for container dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Add effect to update dimensions
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);
  const user = userData?.user || {};
  const members = data?.members || [];
  const totalEarnings = members.reduce((acc: any, cur: any) => {
    acc += cur.firstPackagePrice * 0.1;
    return acc;
  }, 0);
  const referralUrl = `${location.origin}/register?referral=${id}`;

  const transformData = (members: any[]) => {
    const formatDate = (date: string | number | Date) => {
      try {
        return new Date(date).toLocaleDateString();
      } catch {
        return new Date().toLocaleDateString();
      }
    };

    // Create root node with members as children
    return [
      {
        name: 'You',
        balance: user.balance,
        status: user.status,
        joinedDate: formatDate(user?.joinedAt),
        children: members.map((member: any) => ({
          name: member.username,
          balance: member.balance || 0,
          status: member.status || 'Inactive',
          joinedDate: formatDate(member?.joinedAt),
        })),
      },
    ];
  };

  useEffect(() => {
    if (data?.members) {
      console.log('Transforming data:', data.members);
      const transformed = transformData(data.members);
      console.log('Transformed data:', transformed);
      setTreeData(transformed);
    }
  }, [data]);

  const onHowBonusesWorkClick = () => {
    dispatch(
      openAlertDialog({
        title: 'How Referral Bonuses Work?',
        descriptionNode: (
          <div>
            <p>
              Referral bonuses are a great way to earn extra rewards! Here's how
              they work:
            </p>
            <ol className="list-decimal ml-6 mt-2">
              <li className="mb-2 text-start">
                You earn a <strong>10% bonus</strong> of the initial deposit
                made by your referred user.
              </li>
              <li className="mb-2 text-start">
                The referral bonus will be deposited into your account once the
                referred user's profile status becomes <strong>ACTIVE</strong>.
              </li>
              <li className="mb-2 text-start">
                A referred user's profile status changes to{' '}
                <strong>ACTIVE</strong> after they make their first deposit.
              </li>
            </ol>
            <p className="mt-2">
              This means you will receive your referral bonus after your
              referred user completes their first deposit. Start sharing your
              referral link and earn rewards today!
            </p>
          </div>
        ),
        onPress: async () => {
          dispatch(closeAlertDialog());
        },
      }),
    );
  };

  return (
    <div className="mt-6">
      <h1 className="text-3xl">My Team ({members.length})</h1>
      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <InfoBox
          title="Total earnings from team"
          value={`${totalEarnings} USDC`}
        />
      </div>
      <div className="my-6">
        <p className="mb-2">Your referral code QR:</p>
        <div className="flex max-[1036px]:flex-col">
          <QRCodeSVG
            value={referralUrl}
            size={220}
            height={220}
            width={220}
            bgColor="#c1c1c1"
          />
          <div>
            <div className="min-[1036px]:ml-4 max-[1036px]:mt-4">
              <p>Referral code:</p>
              <ValueWithCopyIcon value={id} isUnderline />
            </div>
            <div className="min-[1036px]:ml-4 max-[1036px]:mt-4">
              <p>Referral url:</p>
              <ValueWithCopyIcon value={referralUrl} isUnderline />
            </div>
          </div>
        </div>
      </div>
      <Button
        className="my-6"
        variant="secondary"
        onClick={onHowBonusesWorkClick}
      >
        <CircleHelp />
        How do bonuses work?
      </Button>

      {/* Network Tree Visualization */}
      <div className="mt-8 p-0.5 rounded-xl bg-gradient-to-r from-white/10 via-white/5 to-white/10">
        <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-medium text-white mb-6">
            Member Network
          </h2>
          <div
            ref={containerRef}
            style={{ width: '100%', height: '600px' }}
            className="relative"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-white loading-text">
                  Loading network...
                </div>
              </div>
            ) : treeData.length > 0 ? (
              <Tree
                data={treeData}
                orientation="vertical"
                renderCustomNodeElement={CustomNode}
                separation={{ siblings: 2, nonSiblings: 2.5 }}
                translate={{
                  x: dimensions.width / 2,
                  y: 200,
                }}
                nodeSize={{ x: 320, y: 350 }}
                zoomable={true}
                collapsible={false}
                pathFunc="curve"
                styles={{
                  links: {
                    stroke: '#ffffff',
                    strokeWidth: 1.5,
                    opacity: 0.7,
                    fill: 'none',
                  },
                }}
                centeringTransitionDuration={200}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white">No team members yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
