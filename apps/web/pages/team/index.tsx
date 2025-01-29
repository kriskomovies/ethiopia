import ValueWithCopyIcon from '@/components/value-with-copy-icon/value-with-copy-icon';
import {
  closeAlertDialog,
  openAlertDialog,
} from '@/redux/features/modal-slice';
import {
  useGetUserByIdQuery,
  useGetUserMembersQuery,
} from '@/redux/services/users.service';
import { useAppSelector } from '@/redux/store';
import { HelpCircle, QrCode } from 'lucide-react';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import Tree, { PathFunctionOption } from 'react-d3-tree';
import { useDispatch } from 'react-redux';

// Custom node component for the tree
const CustomNode: FC<any> = ({ nodeDatum }) => {
  const isActive = nodeDatum.status === 'ACTIVE';
  return (
    <g>
      <foreignObject
        x="-150"
        y="-50"
        width="300"
        height="120"
        style={{ overflow: 'visible', clipPath: 'inset(0 0 -100% 0)' }}
      >
        <div
          className={`p-4 backdrop-blur-md rounded-xl border ${
            isActive ? 'border-green-500' : 'border-white/10'
          } bg-black/40 shadow-lg`}
        >
          <div className="space-y-1.5 text-left">
            <h3 className="font-medium text-lg text-white">{nodeDatum.name}</h3>
            <div className="space-y-1 text-sm">
              <div className="text-white/60">
                Earnings: ${nodeDatum.balance}
              </div>
              <div className="text-white/60">
                Joined: {nodeDatum.joinedDate}
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
      <circle r="1" fill="white" cy="-50" />
    </g>
  );
};

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

  // Add this function to check if there are any active members
  const hasActiveMembers = (members: any[]) => {
    return members.some((member) => member.status === 'ACTIVE');
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-semibold mb-2">Your Referrals</h1>
      <p className="text-white/60 mb-6">
        Invite friends and earn rewards when they join and participate in our
        platform. Monitor your referral activity and earnings below.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="backdrop-blur-md p-6 bg-black/40 rounded-xl border border-white/10">
          <p className="text-white/60 mb-2">Total Earnings</p>
          <p className="text-2xl font-semibold">${totalEarnings}</p>
        </div>
        <div className="backdrop-blur-md p-6 bg-black/40 rounded-xl border border-white/10">
          <p className="text-white/60 mb-2">Active Referrals</p>
          <p className="text-2xl font-semibold">
            {members.filter((m) => m.status === 'ACTIVE').length}
          </p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Referral Link</h2>
        <p className="text-white/60 mb-4">
          Share this link with friends to earn rewards when they join
        </p>
        <div className="backdrop-blur-md flex items-center justify-between gap-2 p-4 bg-black/40 rounded-xl border border-white/10">
          <div className="flex-1">
            <ValueWithCopyIcon value={referralUrl} />
          </div>
          <div className="flex items-center gap-2">
            <div
              className="cursor-pointer border-primary border-2 p-2 rounded-xl hover:scale-110 transition-all duration-100"
              onClick={() => {
                dispatch(
                  openAlertDialog({
                    title: 'QR Code',
                    descriptionNode: (
                      <div className="flex justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${referralUrl}`}
                          alt="QR Code"
                          width={200}
                          height={200}
                        />
                      </div>
                    ),
                    onPress: () => dispatch(closeAlertDialog()),
                  }),
                );
              }}
            >
              <QrCode />
            </div>
            <div
              className="cursor-pointer border-primary border-2 p-2 rounded-xl hover:scale-110 transition-all duration-100"
              onClick={onHowBonusesWorkClick}
            >
              <HelpCircle />
            </div>
          </div>
        </div>
      </div>

      {/* Network Visualization */}

      <div className="mb-8">
        <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
          <div
            ref={containerRef}
            style={{ width: '100%', height: '600px' }}
            className="relative"
          >
            <div className="bg-black">
              <h2 className="text-xl font-semibold mb-2">
                Your Referral Network
              </h2>
              <p className="text-white/60 mb-4">
                Visualize your referral network and their earnings
              </p>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-white/60">Loading network...</div>
              </div>
            ) : treeData.length > 0 ? (
              <Tree
                data={treeData}
                orientation="vertical"
                renderCustomNodeElement={CustomNode as any}
                separation={{ siblings: 2, nonSiblings: 2.5 }}
                translate={{
                  x: dimensions.width / 2,
                  y: 200,
                }}
                dimensions={{
                  width: dimensions.width,
                  height: 600,
                }}
                nodeSize={{ x: 320, y: 350 }}
                zoom={1}
                enableLegacyTransitions={true}
                transitionDuration={200}
                pathFunc={'curved' as PathFunctionOption}
                pathClassFunc={() => 'text-white/20'}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white/60">No team members yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
